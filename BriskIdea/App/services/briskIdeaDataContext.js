var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/dataContext'], function(require, exports, __dc__) {
    
    var dc = __dc__;

    var BriskIdeaDataContext = (function (_super) {
        __extends(BriskIdeaDataContext, _super);
        function BriskIdeaDataContext() {
            _super.call(this, { url: 'api/breeze' });
            this.todos = ko.observableArray();
        }
        BriskIdeaDataContext.prototype.init = function () {
            var _this = this;
            return _super.prototype.init.call(this, function () {
                return _this.getTodos(_this.todos);
            });
        };

        BriskIdeaDataContext.prototype.getTodos = function (observable) {
            var query = this.breeze.EntityQuery.from('todos');
            return this.get(query, observable);
        };

        BriskIdeaDataContext.prototype.createTodo = function (config, state) {
            if (!config.hasOwnProperty('createdOn'))
                config.createdOn = new Date();
            return this.createEntity('Todo', config, state);
        };
        return BriskIdeaDataContext;
    })(dc.DataContext);
    exports.BriskIdeaDataContext = BriskIdeaDataContext;

    exports.instance = new BriskIdeaDataContext();
});
//@ sourceMappingURL=briskIdeaDataContext.js.map
