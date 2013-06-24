/// <reference path="../reference.ts" />

export interface ITodo extends breeze.Entity {
    id: KnockoutObservable<number>;
    title: KnockoutObservable<string>;
    notes: KnockoutObservable<string>;
    isDone: KnockoutObservable<boolean>;
    createdOn: KnockoutObservable<Date>;
}
