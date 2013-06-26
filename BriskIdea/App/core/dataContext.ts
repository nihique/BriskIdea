/// <reference path="../reference.d.ts" />

import system = require('durandal/system');
import logger = require('core/logger');
import utils = require('core/utils');

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

    public AUTO_SYNC_INTERVAL = 5000;
    
    private _autoSyncInterval: number = undefined;

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
        this.isWorking = ko.computed(() => this.isSaving() || this.isDeleting() || this.isQuering());
        this.canSave = ko.computed(() => this.hasChanges() && !this.isSaving());
    }

    //#region public

    public init(afterBreezeConfigCallback: () => any = () => { }) {
        return Q
            .fcall(() => logger.instance.log('datacontext.init() started'))
            .then(() => this._configureBreeze())
            .then(() => afterBreezeConfigCallback())
            .then(() => Q.all([
                //getUserByLogin(config.login, session.user),
                //getLookups(lookups)
            ]))
            .then(() => logger.instance.log('datacontext.init() finished'));
    }

    public turnOnAutoSync(intervalInMsec: number = this.AUTO_SYNC_INTERVAL) {
        this.turnOffAutoSync();
        this._autoSyncInterval = setInterval(() => this.syncChanges(), intervalInMsec);
    }

    public turnOffAutoSync() {
        if (this._autoSyncInterval === undefined) return;
        clearInterval(this._autoSyncInterval);
        this._autoSyncInterval = undefined;
    }

    public syncChanges() {
        this.saveChanges();
    }

    public saveChanges() {
        if (!this.entityManager.hasChanges()) return;

        this.isSaving(true);

        logger.instance.log('saving changes started');

        var entities = this.entityManager.getChanges();

        _.forEach(entities, entity => {
            if (entity.hasOwnProperty('updatedBy')) {
                debugger;
                throw new Error('TODO');
                //entity.updatedBy(session.user().fullNameLastFirst());
            }
            if (entity.hasOwnProperty('updatedOn')) {
                entity['updatedOn'](new Date());
            }
        });

        return this.entityManager
            .saveChanges()
            .then(saveResult => this._saveSucceeded(saveResult))
            .fail(error => this._saveFailed(error))
            .fin(() => {
                this.isSaving(false);
                logger.instance.log('saving changes finished');
            });
    } 

    public createEntity(typeName: string, config?: any, state?: breeze.EntityStateSymbol) {
        return this.entityManager.createEntity(typeName, config, state);
    }

    public get(query: breeze.EntityQuery, observable, first: boolean = false) {
        this.isQuering(true);
        return query
            .using(this.entityManager)
            .execute()
            .then(data => this._succeededProtected(data, observable, first))
            .fail(this._failedProtected)
            .fin(() => this.isQuering(false));
    }

    //#endregion


    //#region protected

    public _succeededProtected(data, observable, first: boolean = false) {
        first = first || false;
        var result = first ? data.results[0] : data.results;
        if (observable) observable(result);
        var msg = 'Data retrieved successfuly.';
        logger.instance.log(msg, data, system.getModuleId(self), false);
    }

    public _failedProtected(error) {
        debugger;
        utils.failed('Error retrieving data:', error);
    }


    //#endregion


    //#region private

    private _configureBreeze() {
        breeze.NamingConvention.camelCase.setAsDefault();
        this._configureAjaxAdapter();
        this._configureManager();
        this._configureEntityQuery();
        return Q.fcall(() => this.metadataStore.fetchMetadata(this.url));
    }

    private _configureEntityQuery() {
        var fromOrig = breeze.EntityQuery.from;
        breeze.EntityQuery.from =
            entities => fromOrig(entities).withParameters({ db: this.db, login: this.login })
    }

    private _configureManager() {
        this.entityManager = new breeze.EntityManager(this.url);
        this.metadataStore = this.entityManager.metadataStore;
        this.entityManager.hasChangesChanged.subscribe(eventArgs => {
            this.hasChanges(eventArgs.hasChanges);
        });
    }

    private _configureAjaxAdapter() {
        var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
        ajaxAdapter.defaultSettings = {
            beforeSend: xhr => {
                xhr.setRequestHeader("db", this.db);
                xhr.setRequestHeader("login", this.login);
            }
        };
    }

    private _saveSucceeded (saveResult) {
        logger.instance.log("Changes saved successfully.", saveResult, system.getModuleId(self), true);
    }

    private _saveFailed(error: { message: string }) {
        var msg = "<strong>Save Failed:</strong> " + this._getErrorMessages(error);
        logger.instance.logError(msg, error, system.getModuleId(self), true);
        error.message = msg;
        throw error;
    }
    private _getErrorMessages(error: { message: string }) {
        var msg = error.message;
        var isValidationError = msg.match(/validation error/i);
        if (isValidationError) return this._getValidationMessages(error);
        return msg;
    }

    private _getValidationMessages(error) {
        try {
            var errorList = _(error.entitiesWithErrors)
                .map(entity =>
                    _(entity.entityAspect.getValidationErrors())
                        .map(this._formatPropertyError)
                        .join(''));
            return _.sprintf('<div style="margin-top: 5px">%s</div>', errorList);
        }
        catch (e)
        {
            logger.instance.log('getValidationMessages() error', error);
        }
        return 'validation error';
    }

    private _formatPropertyError(valError) {
        var propertyName = _(valError.errorMessage)
            .chain()
            .strRight("'")
            .strLeft("'")
            .humanize()
            .titleize()
            .value();

        var whatIsWrong = _.strRightBack(valError.errorMessage, "'");

        return _.sprintf('<div><em>%s</em>%s', propertyName, whatIsWrong);
    }

    //#endregion
}
