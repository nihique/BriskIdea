/// <reference path="../Scripts/typings/durandal/durandal.d.ts" />

import app = require('durandal/app');
import system = require('durandal/system');
import viewLocator = require('durandal/viewLocator');
import router = require('durandal/plugins/router');
import dataContext = require('services/briskIdeaDataContext')

export interface IBootstrapper {
    run(): void
}

export class Bootstrapper implements IBootstrapper {
    run() {
        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'BriskIdea';

        return app

            // start durandal app
            .start()

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
            })

            // init datacontext
            .then(() => dataContext.instance.init());
    }
}

return new Bootstrapper();