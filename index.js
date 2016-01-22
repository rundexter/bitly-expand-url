var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://api-ssl.bitly.com/'
});

var pickInputs = {
        'shortUrl': 'shortUrl',
        'hash': 'hash'
    },
    pickOutputs = {
        'short_url': { key: 'data.expand', fields: ['short_url'] },
        'hash': { key: 'data.expand', fields: ['hash'] },
        'user_hash': { key: 'data.expand', fields: ['user_hash'] },
        'global_hash': { key: 'data.expand', fields: ['global_hash'] },
        'long_url': { key: 'data.expand', fields: ['long_url'] }
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            token = dexter.provider('bitly').credentials('access_token'),
            api = '/v3/expand';

        if (validateErrors)
            return this.fail(validateErrors);

        inputs.access_token = token;
        request.get({uri: api, qs: inputs, json: true}, function (error, response, body) {
            if (error)
                this.fail(error);
            else if (body && body.status_code !== 200)
                this.fail(body);
            else
                this.complete(util.pickOutputs(body, pickOutputs));
        }.bind(this));
    }
};
