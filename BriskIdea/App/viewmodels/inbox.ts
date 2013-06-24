/// <reference path="../reference.ts" />

import model = require('models/model');
import vm = require('services/briskIdeaViewModel');

export class Inbox extends vm.BriskIdeaViewModel {

    public rapidEntryText = ko.observable<string>();

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