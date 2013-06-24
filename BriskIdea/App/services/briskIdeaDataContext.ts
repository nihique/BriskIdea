/// <reference path="../reference.ts" />

import model = require('models/model');
import dataContext = require('core/dataContext');

export class BriskIdeaDataContext extends dataContext.DataContext {

    constructor() {
        super({ url: 'api/breeze'});
    }

    public getTodos(observable: KnockoutObservableArray<model.ITodo>) {
        var query = this.breeze.EntityQuery.from('todos');
        return this.get(query, observable);
    }
}

export var instance = new BriskIdeaDataContext();