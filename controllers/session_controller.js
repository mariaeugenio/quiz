var userController = require('./user_controller');


// GET /session   -- Formulario de login
exports.new = function(req, res, next) {
    res.render('session/new');
};


// POST /session   -- Crear la sesion si usuario se autentica
exports.create = function(req, res, next) {

    var login     = req.body.login;
    var password  = req.body.password;

    userController.autenticar(login, password)
        .then(function(user) {

            // Crear req.session.user y guardar campos id y username
            // La sesión se define por la existencia de: req.session.user
            req.session.user = {id:user.id, username:user.username};

            res.redirect("/"); // redirección a la raiz
        })
        .catch(function(error) {
            req.flash('error', 'Se ha producido un error: ' + error);
            res.redirect("/session");        
    });
};


// DELETE /session   -- Destruir sesion 
exports.destroy = function(req, res, next) {

    delete req.session.user;
    
    res.redirect("/session"); // redirect a login
};

exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/session?redir='+(req.param('redir') || req.url));
    }
}
/*
var userController = require('./user_controller');


// GET /session   -- Formulario de login
exports.new = function(req, res, next) {
    var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
    if(redir === '/session' || redir === '/users/new') { redir = "/"; }
    res.render('session/new', {redir: redir});
};


// POST /session   -- Crear la sesion si usuario se autentica
exports.create = function(req, res, next) {

    var redir = req.body.redir || '/'
    var login     = req.body.login;
    var password  = req.body.password;

    var authenticate = function(login, password) {
        return models.User.findOne({where: {username: login}})
            .then(function(user) {
                if(user && user.verifyPassword(password)) {
                    return user;
                } else {
                    return null;
                }
            });
    };

    authenticate(login, password)
        .then(function(user) {
            if (user) {
                req.session.user = {id:user.id, username:user.username};
                res.redirect(redir);
            } else {
                req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez.');
                res.redirect("/session?redir="+redir);
            }
		})
		.catch(function(error) {
            req.flash('error', 'Se ha producido un error: ' + error);
            next(error);        
    });
};


// DELETE /session   -- Destruir sesion 
exports.destroy = function(req, res, next) {

    delete req.session.user;
    
    res.redirect("/session"); // redirect a login
}; */