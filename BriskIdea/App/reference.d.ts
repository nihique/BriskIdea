// External libraries and definitions
/// <reference path="../Scripts/typings/q/Q.d.ts" />
/// <reference path="../Scripts/typings/breeze/breeze-custom.d.ts" />
/// <reference path="../Scripts/typings/durandal/durandal.d.ts" />
/// <reference path="../Scripts/typings/toastr/toastr.d.ts" />

interface ITodo extends breeze.Entity {
    id: KnockoutObservable<number>;
    title: KnockoutObservable<string>;
    notes: KnockoutObservable<string>;
    isDone: KnockoutObservable<boolean>;
    createdOn: KnockoutObservable<Date>;
}
