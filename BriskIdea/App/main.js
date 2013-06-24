/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

require(['bootstrapper'], function (bootstrapper) {
    bootstrapper.run();
});
//@ sourceMappingURL=main.js.map
