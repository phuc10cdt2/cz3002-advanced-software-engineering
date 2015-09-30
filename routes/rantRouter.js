var express = require('express');
var router = express.Router();
var RantController = require('../controllers/RantController');
var pass = require('../config/passport');

router.post('/', pass.ensureAuthenticated, RantController.create);
router.get('/', pass.ensureAuthenticated, RantController.get);
router.post('/viewRant', pass.ensureAuthenticated, RantController.updateViewer);
module.exports = router;