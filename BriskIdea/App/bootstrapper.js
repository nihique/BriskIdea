define(["require", "exports", 'durandal/app', 'durandal/system', 'durandal/viewLocator', 'durandal/plugins/router', 'services/briskIdeaDataContext'], function(require, exports, __app__, __system__, __viewLocator__, __router__, __dataContext__) {
    /// <reference path="../Scripts/typings/durandal/durandal.d.ts" />
    var app = __app__;
    var system = __system__;
    var viewLocator = __viewLocator__;
    var router = __router__;
    var dataContext = __dataContext__;

    var Bootstrapper = (function () {
        function Bootstrapper() {
        }
        Bootstrapper.prototype.run = function () {
            //>>excludeStart("build", true);
            system.debug(true);

            //>>excludeEnd("build");
            app.title = 'BriskIdea';

            return app.start().then(function () {
                //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
                //Look for partial views in a 'views' folder in the root.
                viewLocator.useConvention();

                //configure routing
                router.useConvention();
                router.mapNav('inbox');
                router.mapNav('next');
                router.mapNav('later');
                router.mapNav('waiting');
                router.mapNav('scheduled');
                router.mapNav('someday');
                router.mapNav('focus');

                app.adaptToDevice();

                //Show the app by setting the root view model for our application with a transition.
                app.setRoot('viewmodels/shell', 'entrance');
            }).then(function () {
                return dataContext.instance.init();
            });
        };
        return Bootstrapper;
    })();
    exports.Bootstrapper = Bootstrapper;

    return new Bootstrapper();
});
//@ sourceMappingURL=bootstrapper.js.map
