/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import vm = require('services/briskIdeaViewModel');

export class Inbox extends vm.BriskIdeaViewModel {

    public rapidEntryText = ko.observable<string>();
    public todosActive: KnockoutComputed<Array<ITodo>>;
    public todosDone: KnockoutComputed<Array<ITodo>>;

    constructor() {
        super();
        this.todosActive = ko.computed(() => {
            return _.filter(this.dataContext.todos(), x => !x.isDone());
        });
        this.todosDone = ko.computed(() => {
            return _.filter(this.dataContext.todos(), x => x.isDone());
        });
    }

    public rapidEntry() {
        var rapidEntryText = this.rapidEntryText();
        if (rapidEntryText === undefined) return;
        var todo = this.dataContext.createTodo({ title: rapidEntryText });
        this.dataContext.todos.push(todo);
        this.rapidEntryText(undefined);
    }

    public makeDone(todo: ITodo) {
        todo.isDone(true);
    }

    public makeActive(todo: ITodo) {
        todo.isDone(false);
    }

    public delete(todo: ITodo) {
        //this.dataContext.delete(todo);
        return app.showMessage('TODO: delete');
    }
}

export var instance = new Inbox();

return instance;