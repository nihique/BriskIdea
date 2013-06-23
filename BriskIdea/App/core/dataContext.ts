/// <reference path="../reference.ts" />
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

    public init(afterBreezeConfigCallback) {
        return Q
            .fcall(() => {
                logger.instance.log('datacontext.init() started');
            })
            .then(this.configureBreeze)
            .then(afterBreezeConfigCallback)
            .then(() => {
                return Q.all([
                    //getUserByLogin(config.login, session.user),
                    //getLookups(lookups)
                ]);
            })
            .then(() => {
                logger.instance.log('datacontext.init() finished');
            });
    }

    private configureBreeze() {
        return Q
            .fcall(() => {
                breeze.NamingConvention.camelCase.setAsDefault();
                this.configureAjaxAdapter();
                this.configureManager();
                this.configureEntityQuery();
            })
            .then(() => { return this.metadataStore.fetchMetadata(this.url); });
    }

    private configureEntityQuery() {
        var fromOrig = breeze.EntityQuery.from;
        breeze.EntityQuery.from =  (entities) => {
            return fromOrig(entities)
                .withParameters({ db: this.db, login: this.login });
        };
    }

    private configureManager() {
        this.entityManager = new breeze.EntityManager(this.url);
        this.metadataStore = this.entityManager.metadataStore;
        this.entityManager.hasChangesChanged.subscribe((eventArgs) => {
            this.hasChanges(eventArgs.hasChanges);
        });
    }

    private configureAjaxAdapter() {
        var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
        ajaxAdapter.defaultSettings = {
            beforeSend: (xhr) => {
                xhr.setRequestHeader("db", this.db);
                xhr.setRequestHeader("login", this.login);
            }
        };
    }
}
