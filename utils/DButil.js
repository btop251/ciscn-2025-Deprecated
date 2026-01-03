const db = require('better-sqlite3')('./database.db',{readonly : false});

module.exports = {
    getUser(username){
        let result=db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        return result;
    },

    checkUser(username){
        let result=db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        return (result === undefined);
    },

    createUser(username, password){
        let query = 'INSERT INTO users(username, password) VALUES(?,?)';
        db.prepare(query).run(username,password);
    },

    attemptLogin(username, password){
        let result=db.prepare(`SELECT * FROM users WHERE username = ? AND password = ?`).get(username,password);
        return (result !== undefined);
    },
    sendFeedback(message){
        db.prepare(`INSERT INTO messages VALUES('${message}')`).run();
    }
}