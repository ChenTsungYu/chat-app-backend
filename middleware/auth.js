const jwt = require('jsonwebtoken');
const config = require('../config/app');

exports.auth = (req, res, next) => {
    // console.log("authHeader: ", authHeader);
    /*
        authHeader 回傳結果為 Bearer xxxxxxxxxxx
        xxxxxxxxxxx -> 表 token
    */
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log("token: ", token);
    if (!token) {
        return res.status(401).json({ error: 'Missing token!' })
    };

    jwt.verify(token, config.appKey, (err, user) => {
        if (err) {
            return res.status(401).json({ error: err });
        };
        // console.log("jwt verify user token: ", user);
        req.user = user;
    });

    next();
};