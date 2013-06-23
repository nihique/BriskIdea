define(["require", "exports", 'core/logger'], function(require, exports, __logger__) {
    var logger = __logger__;

    var DataContext = (function () {
        function DataContext(options) {
            var _this = this;
            this.breeze = breeze;
            this.url = options.url;
            this.db = options.db;
            this.login = options.login;
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
                _this.configureAjaxAdapter();
                _this.configureManager();
                _this.configureEntityQuery();
            }).then(function () {
                return _this.metadataStore.fetchMetadata(_this.url);
            });
        };

        DataContext.prototype.configureEntityQuery = function () {
            var _this = this;
            var fromOrig = breeze.EntityQuery.from;
            breeze.EntityQuery.from = function (entities) {
                return fromOrig(entities).withParameters({ db: _this.db, login: _this.login });
            };
        };

        DataContext.prototype.configureManager = function () {
            var _this = this;
            this.entityManager = new breeze.EntityManager(this.url);
            this.metadataStore = this.entityManager.metadataStore;
            this.entityManager.hasChangesChanged.subscribe(function (eventArgs) {
                _this.hasChanges(eventArgs.hasChanges);
            });
        };

        DataContext.prototype.configureAjaxAdapter = function () {
            var _this = this;
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("db", _this.db);
                    xhr.setRequestHeader("login", _this.login);
                }
            };
        };
        return DataContext;
    })();
    exports.DataContext = DataContext;
});
//@ sourceMappingURL=dataContext.js.map
