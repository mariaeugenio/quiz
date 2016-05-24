var models = require('../models');
var Sequelize = require('sequelize');


// Autoload el user asociado a :userId
exports.load = function(req, res, next, userId) {
    models.User.findById(userId)
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                req.flash('error', 'No existe el usuario con id='+id+'.');
                next(new Error('No existe userId=' + userId));
            }
        })
        .catch(function(error) { next(error); });
};


// GET /users
exports.index = function(req, res, next) {
    models.User.findAll({order: ['username']})
        .then(function(users) {
            res.render('users/index', { users: users });
        })
        .catch(function(error) { next(error); });
};


// GET /users/:id
exports.show = function(req, res, next) {
    res.render('users/show', {user: req.user});
};


// GET /users/new
exports.new = function(req, res, next) {
    var user = models.User.build({ username: "", 
                                   password: "" });

    res.render('users/new', { user: user });
};


// POST /users
exports.create = function(req, res, next) {
    var user = models.User.build({ username: req.body.user.username,
                                   password: req.body.user.password
                                });

    // El login debe ser unico:
    models.User.find({where: {username: req.body.user.username}})
        .then(function(existing_user) {
            if (existing_user) {
                var emsg = "El usuario \""+ req.body.user.username +"\" ya existe."
                req.flash('error', emsg);
                res.render('users/new', { user: user });
            } else {
                // Guardar en la BBDD
                return user.save({fields: ["username", "password", "salt"]})
                    .then(function(user) { // Renderizar pagina de usuarios
                        req.flash('success', 'Usuario creado con éxito.');
                        res.redirect('/session');
                    })
                    .catch(Sequelize.ValidationError, function(error) {
                        req.flash('error', 'Errores en el formulario:');
                        for (var i in error.errors) {
                            req.flash('error', error.errors[i].value);
                        };
                        res.render('users/new', { user: user });
                    });
            }
        })
        .catch(function(error) { 
            next(error);
        });
};


// GET /users/:id/edit
exports.edit = function(req, res, next) {
    res.render('users/edit', { user: req.user });  // req.user: instancia de user cargada con autoload
};            


// PUT /users/:id
exports.update = function(req, res, next) {

    req.user.username  = req.body.user.username;
    req.user.password  = req.body.user.password;

    req.user.save({fields: ["username", "password", "salt"]})
        .then(function(user) {
            req.flash('success', 'Usuario actualizado con éxito.');
            res.redirect('/users');  // Redirección HTTP a /
        })
        .catch(Sequelize.ValidationError, function(error) {

            req.flash('error', 'Errores en el formulario:');
            for (var i in error.errors) {
                req.flash('error', error.errors[i].value);
            };

            res.render('users/edit', {user: req.user});
        })
        .catch(function(error) {
            next(error);
        });
};


// DELETE /users/:id
exports.destroy = function(req, res, next) {
    req.user.destroy()
        .then(function() {
            // Borrando usuario logeado.
            if (req.session.user && req.session.user.id === req.user.id) {
                // borra la sesión y redirige a /
                delete req.session.user;
            }
            req.flash('success', 'Usuario eliminado con éxito.');
            res.redirect('/');
        })
        .catch(function(error){ 
            next(error); 
        });
};



/*
 * Autenticar un usuario: Comprueba si el usuario esta registrado en users
 *
 * Devuelve una Promesa que busca el usuario con el login dado y comprueba su password.
 * La promesa se satisface si todo es correcto, y devuelve un objeto con el User.
 * La promesa falla si la autenticación falla o si hay errores.
 */
exports.autenticar = function(login, password) {
    
    return models.User.findOne({where: {username: login}})
        .then(function(user) {
            if (user && user.verifyPassword(password)) {
                return user;
            } else {
                throw new Error('Autenticación fallida.');
            }
        });
}; 