'use strict';
module.exports = app => {
    const db = require('./controllers');
    app.route('/api/v1/info')
        .post(db.save)
        .get(db.retrieve);
}