define(['config',
        'durandal/system',
        'durandal/app',
        'durandal/plugins/router',
        'services/utils',
        'services/logger',
        'services/session'],
    function (config, system, app, router, utils, logger, session) {
        var hasChanges = ko.observable(false);
        var isSaving = ko.observable(false);
        var isDeleting = ko.observable(false);
        var isQuering = ko.observable(false);

        var isWorking = ko.computed(function () {
            return isSaving() || isDeleting() || isQuering();
        });

        var canSave = ko.computed(function () {
            return hasChanges() && !isSaving();
        });

        var lookups = ko.observable({});

        var self = {
            metadataStore: null,
            init: init,
            lookups: lookups,
            hasChanges: hasChanges,
            isSaving: isSaving,
            isDeleting: isDeleting,
            isQuering: isQuering,
            isWorking: isWorking,
            canSave: canSave,
            deleteEntity: deleteEntity,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges,
            saveChangesFor: saveChangesFor,
            fetch: fetch,
            getLookups: getLookups,
            getClients: getClients,
            getDocuments: getDocuments,
            getPeerReviewBatches: getPeerReviewBatches,
            getParameterValue: getParameterValue,
            getParameterText: getParameterText,
            createEntity: createEntity,
            createPeerReviewBatch: createPeerReviewBatch,
            getDataForSelect2Control: getDataForSelect2Control,
            userQuery: userQuery,
            clientQuery: clientQuery
        };

        var manager = undefined,
            entityQuery = undefined,
            predicate = undefined;

        var expand = {
            peerReviewBatches: 'client'
                + ', log.user'
                + ', peerReviewMailBodySpecification.type'
                + ', clientMailBodySpecification.type'
                + ', peerReviewBatchDocuments.document.log.user'
                + ', peerReviewRequestor'
                + ', primaryPeerReviewer'
                + ', delegatePeerReviewer',
            peerReviewBatchesPartials: 'client'
                + ', peerReviewRequestor'
                + ', primaryPeerReviewer'
                + ', delegatePeerReviewer',
            documents: 'log.user'
        };

        //#region internal 

        function init(afterBreezConfigCallback) {
            return Q
                .fcall(function () {
                    logger.log('datacontext.init() started');
                })
                .then(configureBreeze)
                .then(afterBreezConfigCallback)
                .then(function () {
                    return Q.all([
                        getUserByLogin(config.login, session.user),
                        getLookups(lookups)
                    ]);
                })
                .then(function () {
                    logger.log('datacontext.init() finished');
                });
        }

        function deleteEntity(entity) {
            isDeleting(true);
            var title = 'Confirm Delete';
            var msg = 'Do you want to delete this record (ID: ' + entity.id() + ')?';
            app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption !== 'Yes') {
                    isDeleting(false);
                    return;
                }

                // mark entity as deleted or delete it 
                if (entity.hasOwnProperty('deleted')) entity.deleted(true);
                else if (entity.hasOwnProperty('isDeleted')) entity.isDeleted(true);
                else entity.entityAspect.setDeleted();

                saveChanges().then(navigateBack).fail(saveFailed).fin(finish);

                function navigateBack() {
                    router.navigateBack();
                }

                function saveFailed(error) {
                    cancelChanges();
                    var errorMsg = 'Error: ' + error.message;
                    logger.logError(errorMsg, error, system.getModuleId(self), true);
                }

                function finish() {
                    isDeleting(false);
                    return selectedOption;
                }
            }
        }

        function cancelChanges() {
            manager.rejectChanges();
            logger.log('All changes were canceled.', null, system.getModuleId(self), true);
        }

        function saveChangesFor(entities) {
            return saveChangesPrivate(entities);
        }

        function saveChanges() {
            return saveChangesPrivate();
        }

        function fetch(entities, id, observable) {
            var query = entityQuery.from(entities)
                .where('id', '==', id)
                .expand(expand[entities] || '');
            return get(query, observable, true);
        }

        function getLookups(observable) {
            var query = entityQuery.from('lookups');
            return get(query, observable, true);
        }

        function getClients(observable) {
            var query = entityQuery.from('clients')
                .where('officialName', 'startsWith', 'A')
                .orderBy('officialName');
            return get(query, observable);
        }

        function getDocuments(observable, options) {
            options = options || {};
            var predicates = [];
            if (options.clientId) {
                predicates.push(predicate.create('clientId', '==', options.clientId.toString()));
            }
            if (options.documentName) {
                predicates.push(predicate.create('documentName', 'startsWith', options.documentName));
            }
            var query = entityQuery.from('documents')
                .where(predicate.and(predicates))
                .top(options.top || 10)
                .orderByDesc('id');
            return get(query, observable);
        }

        function clientQuery(term) {
            return entityQuery.from('clients')
                .where('officialName', 'startsWith', term)
                .orderBy('officialName')
                .take(20);
        }

        function userQuery(term) {
            return entityQuery.from('users')
                .where('lastName', 'startsWith', term)
                .orderBy('lastName')
                .take(20);
        }

        function getDataForSelect2Control(getBreezeQueryFunc, select2Query) {
            var breezeQuery = getBreezeQueryFunc(select2Query.term);
            var observable = ko.observable({});
            get(breezeQuery, observable).done(function () {
                select2Query.callback({
                    results: observable(),
                });
            });
        }

        function getPeerReviewBatches(userId, clientId, observable) {
            var query = entityQuery.from('peerReviewBatches')
                .orderByDesc('id')
                .top(10)
                .expand(expand.peerReviewBatchesPartials);
            if (_.isNumber(userId) && userId > 0) {
                query = query.where(predicate
                    .create("peerReviewRequestorId", "==", userId)
                    .or("primaryPeerReviewerId", "==", userId)
                    .or("delegatePeerReviewerId", "==", userId));
            }
            if (_.isNumber(clientId) && clientId > 0) {
                query = query.where("clientId", "==", clientId);
            }
            return get(query, observable);
        }

        function createPeerReviewBatch(observable, options) {
            options = options || {};
            _.defaults(options, {
                deleted: false,
                clientId: undefined,
                primaryPeerReviewerId: undefined,
                delegatePeerReviewerId: undefined,
                hbbTableName: 'Client',
                hbbTableId: undefined,
                createdBy: session.user().fullNameLastFirst(),
                createdOn: new Date(),
                updatedBy: session.user().fullNameLastFirst(),
                updatedOn: new Date(),
                peerReviewRequestor: session.user(),
                clientMailImportanceId: 2,
                clientMailBodySpecification: createEntity('MailBodySpecification', { typeId: 1 }),
                peerReviewMailBodySpecification: createEntity('MailBodySpecification', { typeId: 1 })
            });
            var entity = createEntity('PeerReviewBatch', options);
            if (observable) observable(entity);
            return Q.fcall(function () { return entity; });
        }

        function getParameterValue(name, notFoundValue) {
            var parameter = getParameter(name);
            return parameter ? parameter.value() : notFoundValue;
        }

        function getParameterText(name, notFoundValue) {
            var parameter = getParameter(name);
            return parameter ? parameter.text() : notFoundValue;
        }

        //#endregion 


        //#region private 

        function configureBreeze() {
            return Q
                .fcall(function () {
                    breeze.NamingConvention.camelCase.setAsDefault();
                    entityQuery = breeze.EntityQuery;
                    predicate = breeze.Predicate;
                    configureAjaxAdapter();
                    configureManager();
                    configureEntityQuery(entityQuery);
                })
                .then(function () {
                    return self.metadataStore
                        .fetchMetadata(config.url.breezeApi);
                });

            function configureEntityQuery() {
                var fromOrig = entityQuery.from;
                entityQuery.from = function (entities) {
                    return fromOrig(entities).withParameters({ db: config.db, login: config.login });
                };
            }

            function configureManager() {
                manager = new breeze.EntityManager(config.url.breezeApi);
                self.metadataStore = manager.metadataStore;
                manager.hasChangesChanged.subscribe(function (eventArgs) {
                    self.hasChanges(eventArgs.hasChanges);
                });
            }

            function configureAjaxAdapter() {
                var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
                ajaxAdapter.defaultSettings = {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("db", config.db);
                        xhr.setRequestHeader("login", config.login);
                    }
                };
            }
        }

        function saveChangesPrivate() {
            isSaving(true);

            var entities = manager.getChanges();

            _.forEach(entities, function (entity) {
                if (entity.hasOwnProperty('updatedBy')) {
                    entity.updatedBy(session.user().fullNameLastFirst());
                }
                if (entity.hasOwnProperty('updatedOn')) {
                    entity.updatedOn(new Date());
                }
            });

            return manager
                .saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed)
                .fin(finish);

            function saveSucceeded(saveResult) {
                logger.log("Changes saved successfully.", saveResult, system.getModuleId(self), true);
            }

            function saveFailed(error) {
                var msg = "<strong>Save Failed:</strong> " + getErrorMessages(error);
                logger.logError(msg, error, system.getModuleId(self), true);
                error.message = msg;
                throw error;
            }

            function finish() {
                isSaving(false);
            }
        }

        function getErrorMessages(error) {
            var msg = error.message;
            var isValidationError = msg.match(/validation error/i);
            if (isValidationError) return getValidationMessages(error);
            return msg;
        }

        function getValidationMessages(error) {
            try {
                var errorList = _(error.entitiesWithErrors)
                    .map(function (entity) {
                        return _(entity.entityAspect.getValidationErrors())
                            .map(formatPropertyError)
                            .join('');
                    });

                return _.sprintf('<div style="margin-top: 5px">%s</div>', errorList);

                function formatPropertyError(valError) {
                    var propertyName = _(valError.errorMessage)
                        .chain()
                        .strRight("'")
                        .strLeft("'")
                        .humanize()
                        .titleize()
                        .value();

                    var whatIsWrong = _(valError.errorMessage).strRightBack("'");

                    return _.sprintf('<div><em>%s</em>%s', propertyName, whatIsWrong);
                }
            }
            catch (e) {
                logger.log('getValidationMessages() error', error);
            }
            return 'validation error';
        }

        function get(query, observable, first) {
            setIsQuering();
            return query.using(manager).execute()
                .then(function (data) { succeeded(data, observable, first); })
                .fail(failed)
                .fin(setIsNotQuering);
        }

        function setIsQuering() {
            isQuering(true);
        }

        function setIsNotQuering() {
            isQuering(false);
        }

        function succeeded(data, observable, first) {
            first = first || false;
            var result = first ? data.results[0] : data.results;
            if (observable) observable(result);
            var msg = 'Data retrieved successfuly.';
            logger.log(msg, data, system.getModuleId(self), false);
        }

        function failed(error) {
            utils.failed('Error retrieving data:', error);
        }

        function createEntity(entityName, options) {
            options = options || {};
            var entity = manager.createEntity(entityName, options);
            return entity;
        }

        function getParameter(name) {
            return _.find(lookups().parameters, function (x) {
                return x.name().toLowerCase() === name.toLowerCase();
            });
        }

        function getUserByLogin(login, observable) {
            var query = entityQuery.from('users')
                .where('email', '==', login);
            return get(query, observable, true);
        }

        //#endregion 

        return __app.services.datacontext = self;
    }
);