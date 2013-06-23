define(["require", "exports", 'durandal/app', 'durandal/system', 'durandal/viewLocator', 'durandal/plugins/router'], function(require, exports, __app__, __system__, __viewLocator__, __router__) {
    var app = __app__;
    var system = __system__;
    var viewLocator = __viewLocator__;
    var router = __router__;

    var Bootstrapper = (function () {
        function Bootstrapper() {
        }
        Bootstrapper.prototype.run = function () {
            system.debug(true);

            app.title = 'Durandal Starter Kit';
            app.start().then(function () {
                viewLocator.useConvention();

                router.useConvention();
                router.mapNav('inbox');
                router.mapNav('next');
                router.mapNav('later');
                router.mapNav('waiting');
                router.mapNav('scheduled');
                router.mapNav('someday');
                router.mapNav('focus');

                app.adaptToDevice();

                app.setRoot('viewmodels/shell', 'entrance');
            });
        };
        return Bootstrapper;
    })();
    exports.Bootstrapper = Bootstrapper;

    return new Bootstrapper();
});
//@ sourceMappingURL=bootstrapper.js.map
