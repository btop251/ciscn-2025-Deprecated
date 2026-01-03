const express = require('express');
const router = express.Router();
const path = require('path');
const AuthMiddleware = require('../middleware/AuthMiddleWare');
const JWT = require('../utils/JWTutil');
const db = require('../utils/DButil');
const fs = require('fs');

const badwordCheck= (data) => {
    data=data.toLowerCase();
    let badwords = /system|blob|exec|date|rand|char|regexp|unicode|load/g;
    return !!data.match(badwords);
};

const allowedFile = (file) => {
    const format = file.slice(file.indexOf('.') + 1);
    return format == 'log';
};


router.get('/', AuthMiddleware, async (req, res, next) => {
    try{
        let user = await db.getUser(req.data.username);
        if (user === undefined) {
            return res.send(`user ${req.data.username} doesn't exist.`);
        }
        return res.render('index.html', { user });
    }catch (err){
        return next(err);
    }
});

router.get('/viewlog', AuthMiddleware, async (req, res, next) => {
    try{
        let user = await db.getUser(req.data.username);
        if (user === undefined) {
            return res.send(`user ${req.data.username} doesn't exist.`);
        }
        if (req.data.username === 'admin'){
            return res.sendFile(path.resolve('./system.log'));
        }
        else{
            return res.send('Sorry ony admin is accessible.').status(403);
        }
    }catch (err){
        return next(err);
    }
});


router.get('/auth', (req, res) =>
    res.render('auth.html', { query: req.query }));

router.get('/logout', (req, res) => {
    res.clearCookie('session');
    return res.redirect('/auth');
});

router.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    if((username !== undefined && username.trim().length === 0)
        || (password !== undefined && password.trim().length === 0)){
        return res.redirect('/auth');
    }
    if(req.body.register !== undefined){
        let canRegister = await db.checkUser(username);
        if(!canRegister){
            return res.redirect('/auth?msg=Username already exists');
        }
        db.createUser(username, password);
        return res.redirect('/auth?msg=Registered successfully&type=success');
    }

    let canLogin = await db.attemptLogin(username, password);
    if(!canLogin){
        return res.redirect('/auth?msg=Invalid username or password');
    }
    let token = await JWT.sign({
        username: username, priviledge:'Temp User'
    });
    res.cookie('session', token, { maxAge: 1000000 });
    return res.redirect('/');
});


router.get('/feedback', (req,res) => {
    res.render('feedback.html');
});


router.post('/feedback', (req,res) => {
    try{
        let message=req.body.message.replace(/'/g,"\\'").replace(/"/g,"\\\"");
        if(badwordCheck(message)){
            return res.send('Forbidden word in message.');
        }
        db.sendFeedback(message);
    }catch(err){
        throw (err.toString());
    }
    return res.send('OK');
});

router.get('/checkfile', AuthMiddleware, async (req, res, next) => {
    try{
        let user = await db.getUser(req.data.username);
        if (user === undefined) {
            return res.send(`user ${req.data.username} doesn't exist.`);
        }
        if (req.data.username === 'admin' && req.data.priviledge==='File-Priviledged-User'){
            let file=req.query.file;
            if (!file) {
                return res.send('File name not specified.');
            }
            if (!allowedFile(file)) {
                return res.send('File type not allowed.');
            }
            try{
                if (file.includes(' ') || file.includes('/') || file.includes('..')) {
                    return res.send('Invalid filename!');
                }
            }
            catch(err){
                return res.send('An error occured!');
            }

            if (file.length > 10) {
                file = file.slice(0, 10);
            }
            const returned = path.resolve('./' + file);
            fs.readFile(returned, (err) => {
                if (err) {
                    return res.send('An error occured!');
                }
                res.sendFile(returned);
            });
        }
        else{
            return res.send('Sorry Only priviledged Admin can check the file.').status(403);
        }

    }catch (err){
        return next(err);
    }
});
module.exports = router;
