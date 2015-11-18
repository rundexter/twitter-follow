var Twitter = require('twitter');
var optionPrefix = 'twitter_';
var requiredEnv = ['twitter_consumer_key', 'twitter_consumer_secret', 'twitter_access_token', 'twitter_access_token_secret'];

module.exports = {
    follow: function (authOptions, params, callback) {
        var client = new Twitter(authOptions);

        // Allows the authenticating users to follow the user specified in the ID parameter.
        client.get('friendships/create', params, callback);
    },
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        // twitter auth property
        var authOptions = {};

        requiredEnv.forEach(function (envVar) {

            if(dexter.environment(envVar)) {
                // get auth property
                var prop = envVar.substr(optionPrefix.length -1, -1);

                authOptions[prop] = dexter.environment(envVar);
            } else {

                this.fail('A ' + envVar + ' environment variable is required for this module');
            }
        }, this);

        this.follow(authOptions, step.inputs(), function (error, tweets) {

            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return tweets
            this.comcomplete(tweets);
        }.bind(this));
    }
};
