var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/dataContext'], function(require, exports, __dataContext__) {
    
    var dataContext = __dataContext__;

    var BriskIdeaDataContext = (function (_super) {
        __extends(BriskIdeaDataContext, _super);
        function BriskIdeaDataContext() {
            _super.call(this, { url: 'api/breeze' });
        }
        BriskIdeaDataContext.prototype.getTodos = function (observable) {
            var query = this.breeze.EntityQuery.from('todos');
            return this.get(query, observable);
        };
        return BriskIdeaDataContext;
    })(dataContext.DataContext);
    exports.BriskIdeaDataContext = BriskIdeaDataContext;

    exports.instance = new BriskIdeaDataContext();
});
//@ sourceMappingURL=briskIdeaDataContext.js.map
