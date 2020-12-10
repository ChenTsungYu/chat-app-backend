const router = require('express').Router();
const express = require('express');
const app = express();

router.get('/home', (req, res) => {
    return res.send('Home screen');
})

app.set('base', '/v1/api');
router.use('/', require('./auth'));
router.use('/users', require('./user'));
router.use('/chats', require('./chat'));

module.exports = router;