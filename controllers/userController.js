const User = require('../models').User;
const sequelize = require('sequelize');

exports.update = async (req, res) => {
    // console.log(req);
    if (req.file) {
        req.body.avator = req.file.filename;
    };

    if (typeof req.body.avator !== 'undefined' && req.body.avator.length === 0) delete req.body.avator;

    try {
        const [rows, result] = await User.update(req.body,
            {
                where: {
                    id: req.user.id // user data come from auth.js in the folder named middleware
                },
                returning: true,
                individualHooks: true
            }
        );

        const user = result[0].get({ raw: true });
        user.avator = result[0].avator;
        delete user.password;

        return res.send(user);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

exports.search = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                [sequelize.Op.or]: {
                    namesConcated: sequelize.where(
                        // concat first name and last name
                        sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')),
                        {
                            [sequelize.Op.iLike]: `%${req.query.term}%`
                        }
                    ),
                    email: {
                        [sequelize.Op.iLike]: `%${req.query.term}%`
                    }
                },
                // excluded ourselves
                [sequelize.Op.not]: {
                    id: req.user.id
                }
            },
            limit: 10
        })

        return res.json(users)
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}