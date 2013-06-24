/// <reference path="breeze.d.ts" />

declare module breeze {

    interface AjaxAdapterSettings {
        beforeSend: (xhr: JQueryXHR) => void
    }

    interface AjaxAdapter {
        defaultSettings: AjaxAdapterSettings;
    }

    interface BreezeConfig {
        getAdapterInstance(adapterName: string): AjaxAdapter;
    }

    var config: BreezeConfig;

}