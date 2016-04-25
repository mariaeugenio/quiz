var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/question', quizController.question);
router.get('/check', quizController.check);

/* GET author page. */
router.get('/author', function(req, res, next) {
  res.render('author');
});


module.exports = router;
