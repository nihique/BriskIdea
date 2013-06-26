/// <reference path="../reference.d.ts" />

import system = require('durandal/system');
import logger = require('./logger');

export function failed(
    error: { message?: string; responseText?: string },
    title: string = 'Error',
    shouldRethrow: boolean = false) {

    var msg = '<strong>' + title + '</strong><br />' + error.message;

    if (error.responseText) {
        msg += '<br /><br /><strong>Details:</strong><br />' + _.strLeft(error.responseText, '\n');
    }

    logger.instance.logError(msg, error, system.getModuleId(self), true);
    debugger;
    if (shouldRethrow) throw error;
}

export function throwed(msg: string, title?: string) {
    failed(new Error(msg), title, true);
}


