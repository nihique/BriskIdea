/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import system = require('durandal/system');
import router = require('durandal/plugins/router');
import dataContext = require('services/briskIdeaDataContext');

export class Shell {
    router;

    constructor() {
        system.log('constructor()', this)
        this.router = router;
    }

    activate() {
        // init datacontext
        return Q
            .fcall(() => dataContext.instance.init())
            .then(() => router.activate('inbox'));
    }

    search() {
        return app.showMessage('Search not yet implemented...')
    }
}

return new Shell();