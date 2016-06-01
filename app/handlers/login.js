var User = require('../models/schema');
var jwtHelper = require('../helpers/jwt');

var Boom = require('boom');

var login = {
    login: (req, reply) => {

        User.findOne({ email: req.payload.email }, (err, user) => {
            if (err) {
                reply(Boom.badImplementation('Error finding user', err));
            }

            if (!user) {
                return reply(Boom.notFound('User not found'));
            }

            if (!user.password) {
                return reply(Boom.unauthorized('Google user must be authenticated with Google'));
            }

            var token = {
                email: req.payload.email,
                _id: user._id
            };

            if (user.isValidPassword(req.payload.password)) {

                user.update( { lastLogin: Date.now() }, (err, res) => {

                    if (err) {
                        return reply(Boom.badImplementation('Error updating user from db', err));
                    }
                    return reply(jwtHelper.sign(token));
                });
            } else {
                return reply(Boom.unauthorized('Invalid password'));
            }
        });
    }
};

module.exports = login;
