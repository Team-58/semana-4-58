const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const token = require('../services/token');


const login = async(req, res, next) => {
	try {
		console.log(req.body.email)
		let user = await models.Usuario.findOne({ where: { email: req.body.email } });
		if (user) {
			let match = await bcrypt.compare(req.body.password, user.password);
			if (match) {
				console.log(user.rol);
				let tokenReturn = await token.encode(user.id, user.rol);
				res.status(200).json({ user, tokenReturn });
			} else {
				res.status(401).send({
					message: 'Password Incorrecto'
				});
			}
		} else {
			res.status(404).send({
				message: 'No existe el usuario'
			});
		}
	} catch (e) {
		res.status(500).send({
			message: 'Ocurrió un error'
		});
		next(e);
	}
};

const signin = async (req, res, next) => {
	try {
		//const Usuario = await models.Usuario.findOne({where:{email:req.body.email}});
		const Usuario = await models.Usuario.findOne({ where: { email: req.body.email } });
		if (Usuario) {
			const passwordIsValid = bcrypt.compareSync(req.body.password, Usuario.password);
			if (passwordIsValid) {
				const token = jwt.sign({
					id: Usuario.id,
					name: Usuario.name,
					email: Usuario.email,
					//rol: Usuario.rol
				}, 'texto-secreto', {
					expiresIn: 3600
				});
				res.status(200).send({
					auth: true,
					accessToken: token,
					Usuario: Usuario
				});
			} else {
				res.status(401).json({
					error: "error en el usuario o contraseña (contraseña no encontrado)"
				});

			}
		} else {
			res.status(404).json({
				error: "error en el usuario o contraseña (usuario no encontrado)"
			});

		}


	}
	catch (error) {
		res.status(500).send({ message: 'Error' });
		next(error);


	}
};

module.exports = {
	signin,
	login
}