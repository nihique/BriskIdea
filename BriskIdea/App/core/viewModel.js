define(["require", "exports", 'core/logger'], function(require, exports, __logger__) {
    /// <reference path="../reference.ts" />
    var logger = __logger__;
    

    var ViewModel = (function () {
        function ViewModel(dataContext) {
            this.logger = logger.instance;
            this.dataContext = dataContext;
        }
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
//@ sourceMappingURL=viewModel.js.map
