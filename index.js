var Twit = require('twit');
var _ = require('lodash');

module.exports = {
    /**
     * Allows the authenticating users to follow the user specified in the ID parameter.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('twitter').credentials(),
            twitter = new Twit({
                access_token: credentials.access_token,
                access_token_secret: credentials.access_token_secret,
                consumer_key: credentials.consumer_key,
                consumer_secret: credentials.consumer_secret
            });

        twitter.post('friendships/create', step.inputs(), function (error, befriendedInfo) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return befriendedInfo
            this.complete(_.pick(befriendedInfo, ['screen_name', 'follow_request_sent', 'following']));
        }.bind(this));
    }
};
