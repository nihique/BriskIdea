/// <reference path="../reference.d.ts" />

import vm = require('services/briskIdeaViewModel');

class RapidEntry extends vm.BriskIdeaViewModel {

    public rapidEntryText = ko.observable<string>();

    public rapidEntry() {
        var rapidEntryText = this.rapidEntryText();
        if (rapidEntryText === undefined) return;
        var todo = this.dataContext.createTodo({ title: rapidEntryText });
        this.dataContext.todos.push(todo);
        this.rapidEntryText(undefined);
    }
}

export = RapidEntry;