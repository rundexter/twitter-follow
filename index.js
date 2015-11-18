var Twit = require('twit');
var _ = require('lodash');

var mapAuthOptionsEnv = {
    'twitter_consumer_key': 'consumer_key',
    'twitter_consumer_secret': 'consumer_secret',
    'twitter_access_token': 'access_token',
    'twitter_access_token_secret': 'access_token_secret'
};


module.exports = {
    follow: function (authOptions, params, callback) {
        var twitter = new Twit(authOptions);

        // Allows the authenticating users to follow the user specified in the ID parameter.
        twitter.post('friendships/create', params, callback);
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

        _.map(mapAuthOptionsEnv, function (authOpt, twitterOpt) {
            if(dexter.environment(twitterOpt)) {
                // get auth property
                authOptions[authOpt] = dexter.environment(twitterOpt);
            } else {

                this.fail('A ' + twitterOpt + ' environment variable is required for this module');
            }
        }, this);

        this.follow(authOptions, step.inputs(), function (error, tweets) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return tweets
            this.complete(tweets);
        }.bind(this));

        this.complete(step.inputs());
    }
};
