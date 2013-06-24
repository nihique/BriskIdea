define(["require", "exports", 'core/logger'], function(require, exports, __logger__) {
    var logger = __logger__;
    var breeze = Breeze;

    var DataContext = (function () {
        function DataContext() {
            var _this = this;
            this.breeze = breeze;
            this.hasChanges = ko.observable(false);
            this.isSaving = ko.observable(false);
            this.isDeleting = ko.observable(false);
            this.isQuering = ko.observable(false);
            this.isWorking = ko.computed(function () {
                return _this.isSaving() || _this.isDeleting() || _this.isQuering();
            });
            this.canSave = ko.computed(function () {
                return _this.hasChanges() && !_this.isSaving();
            });
        }
        DataContext.prototype.init = function (afterBreezeConfigCallback) {
            return Q.fcall(function () {
                logger.instance.log('datacontext.init() started');
            }).then(this.configureBreeze).then(afterBreezeConfigCallback).then(function () {
                return Q.all([]);
            }).then(function () {
                logger.instance.log('datacontext.init() finished');
            });
        };

        DataContext.prototype.configureBreeze = function () {
            var _this = this;
            return Q.fcall(function () {
                breeze.NamingConvention.camelCase.setAsDefault();
                _this.entityQuery = breeze.EntityQuery;
                _this.predicate = breeze.Predicate;
                configureAjaxAdapter();
                configureManager();
                configureEntityQuery(entityQuery);
            }).then(function () {
                return _this.metadataStore.fetchMetadata(config.url.breezeApi);
            });
        };

        DataContext.prototype.configureEntityQuery = function () {
            var fromOrig = this.entityQuery.from;
            this.entityQuery.from = function (entities) {
                return fromOrig(entities).withParameters({ db: config.db, login: config.login });
            };
        };

        DataContext.prototype.configureManager = function () {
            this.manager = new breeze.EntityManager(config.url.breezeApi);
            this.metadataStore = manager.metadataStore;
            this.manager.hasChangesChanged.subscribe(function (eventArgs) {
                self.hasChanges(eventArgs.hasChanges);
            });
        };

        DataContext.prototype.configureAjaxAdapter = function () {
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("db", config.db);
                    xhr.setRequestHeader("login", config.login);
                }
            };
        };
        return DataContext;
    })();
    exports.DataContext = DataContext;
});
//@ sourceMappingURL=dataContext.js.map
