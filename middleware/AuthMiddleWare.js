const JWT = require('../utils/JWTutil');

module.exports = async (req, res, next) => {
    try{
        if (req.cookies.session === undefined) return res.redirect('/auth');
        let data = await JWT.decode(req.cookies.session);
        req.data = {
            username: data.username,
            priviledge: data.priviledge
        }
        next();
    } catch(e) {
        console.log(e);
        return res.status(500).send('Internal server error');
    }
}