/// <reference path="../reference.d.ts" />

import system = require('durandal/system');

export class Logger {

    public log(message : string, data? : any, source? : any, showToast : boolean = false) {
        this._log(message, data, source, showToast, 'info');
    }

    public logError(message : string, data? : any, source? : any, showToast : boolean = true) {
        this._log(message, data, source, showToast, 'error');
    }

    private _log(message : string, data?, source?, showToast? : boolean, toastType? : string) {
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