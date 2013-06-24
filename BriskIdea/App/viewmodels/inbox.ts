/// <reference path="../reference.ts" />

import model = require('models/model');
import vm = require('services/briskIdeaViewModel');

export class Inbox extends vm.BriskIdeaViewModel {

    public todos = ko.observableArray<model.ITodo>();
    public rapidEntryText = ko.observable<string>();

    public activate() {
        return this.dataContext.getTodos(this.todos);
    }

    public rapidEntry() {
        var rapidEntryText = this.rapidEntryText();
        if (rapidEntryText === undefined) return;
        var todo = this.dataContext.createTodo({ title: rapidEntryText });
        this.todos.push(todo);
        this.rapidEntryText(undefined);
    }
}

export var instance = new Inbox();

return instance;