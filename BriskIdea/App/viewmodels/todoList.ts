/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import vm = require('services/briskIdeaViewModel');

class TodoList extends vm.BriskIdeaViewModel {

    public todos: KnockoutComputed<Array<ITodo>>;

    constructor(public title: string, filter: (todos: Array<ITodo>) => Array<ITodo>) {
        super();
        this.todos = ko.computed(() => filter(this.dataContext.todos()));
    }
}

export = TodoList;