/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import system = require('durandal/system');
import router = require('durandal/plugins/router');
import dataContext = require('services/briskIdeaDataContext');

export class Shell {
    public router;

    constructor() {
        system.log('constructor()', this)
        this.router = router;
    }

    public activate() {
        return Q
            // init datacontext
            .fcall(() => dataContext.instance.init())
            // start router - navigate to home page (inbox)
            .then(() => router.activate('inbox'));
    }

    public search() {
        return app.showMessage('Search not yet implemented...')
    }
}

return new Shell();