/// <reference path="../reference.d.ts" />

import vm = require('services/briskIdeaViewModel');
import TodoList = require('./todoList');

export class Inbox extends vm.BriskIdeaViewModel {

    public todoListActive: TodoList;
    public todoListDone: TodoList;

    private _activated = false;

    public activate(routeInfo) {
        if (this._activated === true) return;
        this.todoListActive = new TodoList('Active', (todos) => _.filter(todos, x => !x.isDone()));
        this.todoListDone = new TodoList('Done', (todos) => _.filter(todos, x => x.isDone()));
        this._activated = true;
    }
}

export var instance = new Inbox();

return instance;