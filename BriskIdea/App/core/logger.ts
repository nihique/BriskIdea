/// <reference path="../reference.ts" />

import system = require('durandal/system');

export class Logger {

    public log(message : string, data? : any, source? : any, showToast : boolean = false) {
        this.logIt(message, data, source, showToast, 'info');
    }

    public logError(message : string, data? : any, source? : any, showToast : boolean = true) {
        this.logIt(message, data, source, showToast, 'error');
    }

    private logIt(message : string, data?, source?, showToast? : boolean, toastType? : string) {
        source = source ? '[' + source + '] ' : '';
        if (data) {
            system.log(source, message, data);
        } else {
            system.log(source, message);
        }
        if (showToast) {
            if (toastType === 'error') {
                toastr.error(message);
            } else {
                toastr.info(message);
            }
        }
    }
}

export var instance = new Logger();