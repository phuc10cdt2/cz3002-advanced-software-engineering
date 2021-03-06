var express = require('express');
var router = express.Router();
var RantController = require('../controllers/RantController');
var pass = require('../config/passport');

router.post('/', pass.ensureAuthenticated, RantController.create);
router.get('/', pass.ensureAuthenticated, RantController.get);
router.get('/myrants', pass.ensureAuthenticated, RantController.getMyRants);
router.post('/viewRant', pass.ensureAuthenticated, RantController.updateViewer);
router.delete('/:id', pass.ensureAuthenticated, RantController.deleteRant);
router.post('/:id', pass.ensureAuthenticated, RantController.update);
module.exports = router;