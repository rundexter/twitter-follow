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

        // Follow
        twitter.post('friendships/create', params, callback);
    },
    /**
     * Allows the authenticating users to follow the user specified in the ID parameter.
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
                // catch no-arguments message
                this.fail('A ' + twitterOpt + ' environment variable is required for this module');
            }
        }, this);

        this.follow(authOptions, step.inputs(), function (error, befriendedInfo) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return befriendedInfo
            this.complete(befriendedInfo);
        }.bind(this));
    }
};
