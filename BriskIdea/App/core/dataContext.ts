/// <reference path="../reference.d.ts" />

import system = require('durandal/system');
import logger = require('core/logger');

export class DataContext {

    public url: string;
    public db: string;
    public login: string;
    public hasChanges: KnockoutObservable<boolean>;
    public isSaving: KnockoutObservable<boolean>;
    public isDeleting: KnockoutObservable<boolean>;
    public isQuering: KnockoutObservable<boolean>;
    public isWorking: KnockoutComputed<boolean>;
    public canSave: KnockoutComputed<boolean>;
    public breeze = breeze;
    public metadataStore: breeze.MetadataStore;
    public entityManager: breeze.EntityManager;

    constructor(options: { 
        url: string; 
        db?: string; 
        login?: string
    }) {
        this.url = options.url;
        this.db = options.db;
        this.login = options.login;
        this.hasChanges = ko.observable(false);
        this.isSaving = ko.observable(false);
        this.isDeleting = ko.observable(false);
        this.isQuering = ko.observable(false);
        this.isWorking = ko.computed(() => { 
            return this.isSaving() || this.isDeleting() || this.isQuering();
        });
        this.canSave = ko.computed(() => { 
            return this.hasChanges() && !this.isSaving()
        });
    }

    //#region public

    public init(afterBreezeConfigCallback: () => any = () => { }) {
        return Q
            .fcall(() => logger.instance.log('datacontext.init() started'))
            .then(() => this._configureBreeze())
            .then(() => afterBreezeConfigCallback())
            .then(() => {
                return Q.all([
                    //getUserByLogin(config.login, session.user),
                    //getLookups(lookups)
                ]);
            })
            .then(() => logger.instance.log('datacontext.init() finished'));
    }

    public createEntity(typeName: string, config?: any, state?: breeze.EntityStateSymbol) {
        return this.entityManager.createEntity(typeName, config, state);
    }

    public get(query: breeze.EntityQuery, observable, first: boolean = false) {
        this.isQuering(true);
        return query
            .using(this.entityManager)
            .execute()
            .then((data) => this.succeeded(data, observable, first))
            .fail(this.failed)
            .fin(() => this.isQuering(false));
    }

    //#endregion


    //#region protected

    public succeeded(data, observable, first: boolean = false) {
        first = first || false;
        var result = first ? data.results[0] : data.results;
        if (observable) observable(result);
        var msg = 'Data retrieved successfuly.';
        logger.instance.log(msg, data, system.getModuleId(self), false);
    }

    public failed(error) {
        debugger;
        //utils.failed('Error retrieving data:', error);
    }


    //#endregion


    //#region private

    private _configureBreeze() {
        return Q
            .fcall(() => {
                breeze.NamingConvention.camelCase.setAsDefault();
                this._configureAjaxAdapter();
                this._configureManager();
                this._configureEntityQuery();
            })
            .then(() => { return this.metadataStore.fetchMetadata(this.url); });
    }

    private _configureEntityQuery() {
        var fromOrig = breeze.EntityQuery.from;
        breeze.EntityQuery.from =  (entities) => {
            return fromOrig(entities)
                .withParameters({ db: this.db, login: this.login });
        };
    }

    private _configureManager() {
        this.entityManager = new breeze.EntityManager(this.url);
        this.metadataStore = this.entityManager.metadataStore;
        this.entityManager.hasChangesChanged.subscribe((eventArgs) => {
            this.hasChanges(eventArgs.hasChanges);
        });
    }

    private _configureAjaxAdapter() {
        var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
        ajaxAdapter.defaultSettings = {
            beforeSend: (xhr) => {
                xhr.setRequestHeader("db", this.db);
                xhr.setRequestHeader("login", this.login);
            }
        };
    }

    //#endregion
}
