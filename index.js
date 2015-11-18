var Twitter = require('twitter-node-client').Twitter;
var _ = require('lodash');

var mapAuthOptionEnv = {
    'twitter_consumer_key': 'consumerKey',
    'twitter_consumer_secret': 'consumerSecret',
    'twitter_access_token': 'accessToken',
    'twitter_access_token_secret': 'accessTokenSecret'
};


module.exports = {
    follow: function (authOptions, params, errorCallback, successCallback) {
        //var twitter = new Twitter(authOptions);

        // Allows the authenticating users to follow the user specified in the ID parameter.
        //twitter.postCreateFriendship(params, errorCallback, successCallback);
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

        _.map(mapAuthOptionEnv, function (authOpt, twitterOpt) {
            if(dexter.environment(twitterOpt)) {
                // get auth property
                authOptions[authOpt] = dexter.environment(twitterOpt);
            } else {

                this.fail('A ' + twitterOpt + ' environment variable is required for this module');
            }
        }, this);

        this.follow(authOptions, step.inputs(), function (error) {
            // if error - send message
            this.fail(error);

        }, function (tweets) {
            // return tweets
            this.complete(tweets);

        }.bind(this));

    }
};
