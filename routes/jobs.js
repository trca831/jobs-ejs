const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs');

router.get('/', jobsController.list);
router.get('/new', jobsController.newForm);
router.post('/', jobsController.create);
router.get('/edit/:id', jobsController.editForm);
router.post('/update/:id', jobsController.update);
router.post('/delete/:id', jobsController.delete);

module.exports = router;