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
                viewLocator.useConvention();
                this._configureRouter();
                app.adaptToDevice();
                app.setRoot('viewmodels/shell', 'entrance');
            });
    }

    private _configureRouter() {
        router.useConvention();
        router.mapNav('inbox');
        router.mapNav('next');
        router.mapNav('later');
        router.mapNav('waiting');
        router.mapNav('scheduled');
        router.mapNav('someday');
        router.mapNav('focus');
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