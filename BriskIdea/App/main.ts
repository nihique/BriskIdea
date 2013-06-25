/// <reference path="../Scripts/typings/requirejs/require.d.ts" />

requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

require(['bootstrapper'], bootstrapper => { 
    bootstrapper.run();
});