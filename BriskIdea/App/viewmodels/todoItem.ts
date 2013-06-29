/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import vm = require('services/briskIdeaViewModel');

class TodoItem extends vm.BriskIdeaViewModel {

    public todo: ITodo;

    constructor(element: HTMLElement, settings:  { bindingContext: KnockoutBindingContext }) {
        super();
        this.todo = settings.bindingContext.$data;
    }

    public toggleDone(todo: ITodo) {
        todo.isDone(!todo.isDone());
    }

    public toggleDoneText(todo: ITodo) {
        return todo.isDone() === true ? 'Undone' : 'Done';
    }

    public delete() {
        //this.dataContext.delete(todo);
        return app.showMessage('TODO: delete');
    }
}

export = TodoItem;