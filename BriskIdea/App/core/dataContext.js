define(["require", "exports", 'durandal/system', 'core/logger'], function(require, exports, __system__, __logger__) {
    var system = __system__;
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
            if (typeof afterBreezeConfigCallback === "undefined") { afterBreezeConfigCallback = function () {
            }; }
            var _this = this;
            return Q.fcall(function () {
                return logger.instance.log('datacontext.init() started');
            }).then(function () {
                return _this._configureBreeze();
            }).then(function () {
                return afterBreezeConfigCallback();
            }).then(function () {
                return Q.all([]);
            }).then(function () {
                return logger.instance.log('datacontext.init() finished');
            });
        };

        DataContext.prototype.get = function (query, observable, first) {
            if (typeof first === "undefined") { first = false; }
            var _this = this;
            this.isQuering(true);
            return query.using(this.entityManager).execute().then(function (data) {
                return _this.succeeded(data, observable, first);
            }).fail(this.failed).fin(function () {
                return _this.isQuering(false);
            });
        };

        DataContext.prototype.succeeded = function (data, observable, first) {
            if (typeof first === "undefined") { first = false; }
            first = first || false;
            var result = first ? data.results[0] : data.results;
            if (observable)
                observable(result);
            var msg = 'Data retrieved successfuly.';
            logger.instance.log(msg, data, system.getModuleId(self), false);
        };

        DataContext.prototype.failed = function (error) {
            debugger;
        };

        DataContext.prototype._configureBreeze = function () {
            var _this = this;
            return Q.fcall(function () {
                breeze.NamingConvention.camelCase.setAsDefault();
                _this._configureAjaxAdapter();
                _this._configureManager();
                _this._configureEntityQuery();
            }).then(function () {
                return _this.metadataStore.fetchMetadata(_this.url);
            });
        };

        DataContext.prototype._configureEntityQuery = function () {
            var _this = this;
            var fromOrig = breeze.EntityQuery.from;
            breeze.EntityQuery.from = function (entities) {
                return fromOrig(entities).withParameters({ db: _this.db, login: _this.login });
            };
        };

        DataContext.prototype._configureManager = function () {
            var _this = this;
            this.entityManager = new breeze.EntityManager(this.url);
            this.metadataStore = this.entityManager.metadataStore;
            this.entityManager.hasChangesChanged.subscribe(function (eventArgs) {
                _this.hasChanges(eventArgs.hasChanges);
            });
        };

        DataContext.prototype._configureAjaxAdapter = function () {
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
