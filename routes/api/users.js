const router = require('express').Router();
const models = require('../../models');
const bcrypt = require('bcryptjs');
const UserController = require('../../controllers/UserController.js');

router.get('/', async (req, res) => {
    const user = await models.Usuario.findAll();
    res.status(200).json(user);
});

router.post('/register', async (req, res) => {
    req.body.password = await bcrypt.hashSync(req.body.password, 10);
    const user = await models.Usuario.create(req.body);
    res.status(200).json(user);
});

router.post('/login', UserController.login);

module.exports = router;


