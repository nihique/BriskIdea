/// <reference path="../reference.ts" />

import model = require('models/model');
import dc = require('core/dataContext');

export class BriskIdeaDataContext extends dc.DataContext {

    constructor() {
        super({ url: 'api/breeze'});
    }

    public getTodos(observable: KnockoutObservableArray<model.ITodo>) {
        var query = this.breeze.EntityQuery.from('todos');
        return this.get(query, observable);
    }

    public createTodo(config?: any, state?: breeze.EntityStateSymbol) {
        if (!config.hasOwnProperty('createdOn')) config.createdOn = new Date();
        return <model.ITodo> this.createEntity('Todo', config, state);
    }

}

export var instance = new BriskIdeaDataContext();