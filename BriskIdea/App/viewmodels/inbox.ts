/// <reference path="../reference.d.ts" />

import app = require('durandal/app');
import vm = require('services/briskIdeaViewModel');
import TodoList = require('./todoList');

export class Inbox extends vm.BriskIdeaViewModel {

    public rapidEntryText = ko.observable<string>();
    public todoListActive: TodoList;
    public todoListDone: TodoList;
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

    public activate(routeInfo) {
        this.todoListActive = new TodoList(this.todosActive);
        this.todoListDone = new TodoList(this.todosDone);
    }

    public rapidEntry() {
        var rapidEntryText = this.rapidEntryText();
        if (rapidEntryText === undefined) return;
        var todo = this.dataContext.createTodo({ title: rapidEntryText });
        this.dataContext.todos.push(todo);
        this.rapidEntryText(undefined);
    }
}

export var instance = new Inbox();

return instance;