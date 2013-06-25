/// <reference path="../reference.d.ts" />

import dc = require('core/dataContext');

export class BriskIdeaDataContext extends dc.DataContext {

    public todos = ko.observableArray<ITodo>();

    constructor() {
        super({ url: 'api/breeze'});
    }

    public init() {
        return super.init(() => {
            // preload and cache all app data 
            this.getTodos(this.todos);
        });
    }

    public getTodos(observable: KnockoutObservableArray<ITodo>) {
        var query = this.breeze.EntityQuery.from('todos');
        return this.get(query, observable);
    }

    public createTodo(config?: any, state?: breeze.EntityStateSymbol) {
        if (!config.hasOwnProperty('createdOn')) config.createdOn = new Date();
        return <ITodo> this.createEntity('Todo', config, state);
    }
}

export var instance = new BriskIdeaDataContext();