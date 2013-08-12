var _ = require('underscore')._;

var pages = function(dbot) {
    return {
        '/report': function(req, res) {
            res.render('servers', {  
                'name': dbot.config.name,
                'servers': _.keys(dbot.config.servers)
            });
        },

        '/report/:server': function(req, res) {
            var server = req.params.server;
            res.render('channels', {
                'name': dbot.config.name,
                'server': server,
                'channels': _.keys(dbot.instance.connections[server].channels)
            });
        },

        '/report/:server/:channel': function(req, res) {
            var server = req.params.server,
                channel = req.params.channel,
                notifies = [];

            this.db.search('notifies', {
                'server': server,
                'channel': channel
            }, function(notify) {
                notifies.push(notify);
            }, function(err) {
                res.render('notifies', {
                    'name': dbot.config.name,
                    'server': server,
                    'notifies': notifies 
                });
            });
        },

        '/report/:server/missing/:user': function(req, res) {
            var server = req.params.server,
                nick = req.params.user;

            dbot.api.users.resolveUser(server, nick, function(user) {
                var notifies = this.pending[user.id];
                res.render('missing_notifies', {
                    'name': dbot.config.name,
                    'user': nick,
                    'notifies': notifies
                });
            }.bind(this));
        }
    };
};

exports.fetch = function(dbot) {
    return pages(dbot);
};
