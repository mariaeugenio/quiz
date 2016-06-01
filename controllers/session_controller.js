var userController = require('./user_controller');
var tiempo = 120000;

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
            req.session.user = {id:user.id, username:user.username, time:Date.now() + tiempo, isAdmin: user.isAdmin};

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

exports.delIdleSession = function(req, res, next) {
    if ( req.session.user) {
        if(req.session.user.time < Date.now()) {
            delete req.session.user;
            req.flash('info', 'La sesión ha caducado.');
        } else {
            req.session.user.time = Date.now()+tiempo;
        }
    }
    next();
};