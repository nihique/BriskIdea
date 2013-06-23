/// <reference path="../reference.ts" />
import app = require('durandal/app');
import system = require('durandal/system');
import router = require('durandal/plugins/router');

export class Shell {
    router;

    constructor() {
        system.log('constructor()', this)
        this.router = router;
    }

    activate() {
        return router.activate('inbox');
    }

    search() {
        return app.showMessage('Search not yet implemented...')
    }
}

return new Shell();