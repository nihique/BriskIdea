/// <reference path="../Scripts/typings/durandal/durandal.d.ts" />

import app = require('durandal/app');
import system = require('durandal/system');
import viewLocator = require('durandal/viewLocator');
import viewModelBinder = require('durandal/viewModelBinder');
import router = require('durandal/plugins/router');
import dataContext = require('services/briskIdeaDataContext')

export interface IBootstrapper {
    run(): void
}

export class Bootstrapper implements IBootstrapper {

    public run() {
        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'BriskIdea';

        return app

            // start durandal app
            .start()

            // initialize and configure vendor js libs
            .then(() => this._initVendorLibs())

            // init durandal
            .then(() => {
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
            });
    }

    private _initVendorLibs() {
        // durandal will throw on binding error instead log only
        viewModelBinder['throwOnErrors'] = true;

        // underscore string 
        _.mixin(_['string'].exports());

        // Toaster config
        toastr.options.timeOut = 6000;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.backgroundpositionClass = 'toast-bottom-right';
    }
}

return new Bootstrapper();