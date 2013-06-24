/// <reference path="../reference.ts" />

export interface ITodo {
    id: KnockoutObservable<number>;
    title: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    createdOn: KnockoutObservable<Date>;
}
