
var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
//      DATABASE_URL = sqlite:///
//      DATABASE_STORAGE = quiz.sqlite
// Usar BBDD Postgres:
//      DATABASE_URL = postgres://user:passwd@hpst:port/database

var url, storage;

if (!process.env.DATABASE_URL){
    url = "sqlite:///";
    storage = "quiz.sqlite";
} else {
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}


// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(url,
                    {storage:storage,
                    omitNull: true
                        });

// Importar la definicion de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar la definicion de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Importar la definicion de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname,'user'));

// Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);


exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definicion de la tabla Comments
exports.User = User;       // exportar definición de tabla Users