const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKey  = fs.readFileSync('./publickey.pem', 'utf8');
const privateKey = fs.readFileSync('./privatekey.pem', 'utf8');

module.exports = {
    async sign(data) {
        data = Object.assign(data);
        return (await jwt.sign(data, privateKey, { algorithm:'RS256'}))
    },
    async decode(token) {
        return (await jwt.verify(token, publicKey, { algorithms: ['RS256','HS256'] }));
    }
}