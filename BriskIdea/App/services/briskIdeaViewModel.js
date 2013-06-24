var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/viewModel', 'services/briskIdeaDataContext'], function(require, exports, __vm__, __dc__) {
    
    var vm = __vm__;
    var dc = __dc__;

    var BriskIdeaViewModel = (function (_super) {
        __extends(BriskIdeaViewModel, _super);
        function BriskIdeaViewModel() {
            _super.call(this, dc.instance);
        }
        return BriskIdeaViewModel;
    })(vm.ViewModel);
    exports.BriskIdeaViewModel = BriskIdeaViewModel;
});
//@ sourceMappingURL=briskIdeaViewModel.js.map
