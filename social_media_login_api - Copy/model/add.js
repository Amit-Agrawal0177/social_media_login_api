const db = require('../helper/db');

exports.fgloginadd = (userProfile, callback) => {
    const { email, displayName, id, provider } = userProfile;
    const INSERT_LOGIN_QUERY = 'INSERT INTO Facebook_Google_login (username, email, facebookid, provider) VALUES (?, ?, ?, ?)';
            
    db.query(INSERT_LOGIN_QUERY, [displayName, email, id, provider], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result.insertId);
        }
    });
};
