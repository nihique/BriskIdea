/// <reference path="../reference.ts" />

import logger = require('core/logger');
import vm = require('core/viewModel');
import dc = require('services/briskIdeaDataContext');

export class BriskIdeaViewModel extends vm.ViewModel<dc.BriskIdeaDataContext> {
    constructor() {
        super(dc.instance);
    }
}
