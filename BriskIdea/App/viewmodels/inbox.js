var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'services/briskIdeaViewModel'], function(require, exports, __vm__) {
    
    var vm = __vm__;

    var Inbox = (function (_super) {
        __extends(Inbox, _super);
        function Inbox() {
            _super.apply(this, arguments);
            this.todos = ko.observableArray();
            this.rapidEntryText = ko.observable();
        }
        Inbox.prototype.activate = function () {
            return this.dataContext.getTodos(this.todos);
        };

        Inbox.prototype.rapidEntry = function () {
            var rapidEntryText = this.rapidEntryText();
            if (rapidEntryText === undefined)
                return;
            var todo = this.dataContext.createTodo({ title: rapidEntryText });
            this.todos.push(todo);
            this.rapidEntryText(undefined);
        };
        return Inbox;
    })(vm.BriskIdeaViewModel);
    exports.Inbox = Inbox;

    exports.instance = new Inbox();

    return exports.instance;
});
//@ sourceMappingURL=inbox.js.map
