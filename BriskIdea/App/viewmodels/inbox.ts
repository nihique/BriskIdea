/// <reference path="../reference.ts" />
import model = require('models/model');
import logger = require('core/logger');
import dataContext = require('services/briskIdeaDataContext');

export class Inbox {

    // base vm
    logger = logger.instance;
    dataContext = dataContext.instance;
    
    // this vm 
    todos = ko.observableArray<model.ITodo>();

    public activate() {
        return this.dataContext
            .init()
            .then(() => this.dataContext.getTodos(this.todos));
    }
}

export var instance = new Inbox();

return instance;