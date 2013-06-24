/// <reference path="../reference.ts" />

import logger = require('core/logger');
import dataContext = require('core/dataContext');

export class ViewModel<TDataContext> {

    public logger = logger.instance;
    public dataContext: TDataContext;

    constructor(dataContext: TDataContext) {
        this.dataContext = dataContext;
    }
}
