define(["require", "exports", 'durandal/app', 'durandal/system', 'durandal/plugins/router'], function(require, exports, __app__, __system__, __router__) {
    var app = __app__;
    var system = __system__;
    var router = __router__;

    var Shell = (function () {
        function Shell() {
            system.log('constructor()', this);
            this.router = router;
        }
        Shell.prototype.activate = function () {
            return router.activate('inbox');
        };

        Shell.prototype.search = function () {
            return app.showMessage('Search not yet implemented...');
        };
        return Shell;
    })();
    exports.Shell = Shell;

    return new Shell();
});
//@ sourceMappingURL=shell.js.map
