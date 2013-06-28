/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import vm = require('services/briskIdeaViewModel');

class TodoList extends vm.BriskIdeaViewModel {

    public todos = ko.observableArray<ITodo>();

    constructor(todos: KnockoutObservableArray<ITodo>) {
        super();
        this.todos = todos;
    }

    public toggleDone(todo: ITodo) {
        todo.isDone(!todo.isDone());
    }

    public delete(todo: ITodo) {
        //this.dataContext.delete(todo);
        return app.showMessage('TODO: delete');
    }

    public toggleDoneText(todo: ITodo) {
        return todo.isDone() === true ? 'Undone' : 'Done';
    }
}

export = TodoList;