/// <reference path="../reference.ts" />

import model = require('models/model');
import vm = require('services/briskIdeaViewModel');

export class Inbox extends vm.BriskIdeaViewModel {

    public todos = ko.observableArray<model.ITodo>();

    public activate() {
        return this.dataContext.getTodos(this.todos);
    }
}

export var instance = new Inbox();

return instance;