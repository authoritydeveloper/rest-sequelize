var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8181;
var _ = require('underscore');
var entities = require('./entities.js');

app.use(bodyParser.json());

app.get('/users', function(req, res) {
    var queryParams = req.query;
    var where = {};
    if (queryParams.hasOwnProperty('admin') && queryParams.admin === 'true') {
        where.isAdmin = true;
    }
    else if (queryParams.hasOwnProperty('admin') && queryParams.admin === 'false') {
        where.isAdmin = false;
    }
    entities.user.findAll({where:where}).then(function(users) {
        res.json(users);
    }, function (ex) {
        res.status(500).send();
    })
})

app.get('/users/:id', function(req, res) {
    var userId = parseInt(req.params.id, 10);
    entities.user.findById(userId).then(function (user) {
        if (!!user) {
            res.json(user);
        } else { 
            res.status(404).send();
        }
    }, function(ex) {
        res.status(500).send();
    })
})

app.post('/users', function(req, res) {
    entities.user.create(req.body).then(function(user) {
        res.json(user);
    }, function (ex) {
        res.status(400).json(ex);
    })
})

app.delete('/users/:id', function (req, res) {
    var userId = parseInt(req.params.id, 10);
    entities.user.destroy({
        where: {
            id: userId
        }
    }).then(function (rows) {
        if (rows === 0) {
            res.status(404).send();
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    })
})

app.put('/users/:id', function (req, res) {
    var userId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'username', 'password', 'isAdmin');
    var normalizeUser = {};

    if (body.hasOwnProperty('isAdmin') && _.isBoolean(body.isAdmin)) {
        normalizeUser.isAdmin = body.isAdmin;
    }
    else if (body.hasOwnProperty('isAdmin')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('username') && _.isString(body.username)) {
        normalizeUser.username = body.username;
    }
    else if (body.hasOwnProperty('username')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('password') && _.isString(body.password)) {
        normalizeUser.password = body.password;
    }
    else if (body.hasOwnProperty('password')) {
        return res.status(400).send();
    }

    entities.user.findById(userId).then(function(user) {
        if (user) {
            user.update(normalizeUser).then(function (user) {
                res.json(user);
            }, function (ex) {
                res.status(404).send();
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    })
    
})

entities.sequelize.sync().then(function() {
    app.listen(port);
})
