define(["require", "exports", 'core/logger', 'services/briskIdeaDataContext'], function(require, exports, __logger__, __dataContext__) {
    
    var logger = __logger__;
    var dataContext = __dataContext__;

    var Inbox = (function () {
        function Inbox() {
            this.logger = logger.instance;
            this.dataContext = dataContext.instance;
            this.todos = ko.observableArray();
        }
        Inbox.prototype.activate = function () {
            var _this = this;
            return this.dataContext.init().then(function () {
                return _this.dataContext.getTodos(_this.todos);
            });
        };
        return Inbox;
    })();
    exports.Inbox = Inbox;

    exports.instance = new Inbox();

    return exports.instance;
});
//@ sourceMappingURL=inbox.js.map
