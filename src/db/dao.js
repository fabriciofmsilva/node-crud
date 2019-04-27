const sqlite3 = require('sqlite3');

const winston = require('../config/winston');

class AppDAO {
  constructor(dbFilePath = 'database.sqlite3') {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        winston.error('Could not connect to database', err);
        return err;
      }

      winston.log('Connected to database');
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          winston.error('Error running sql', sql);
          winston.error(err);
          reject(err);
        }

        resolve({ id: this.lastID });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          winston.error('Error running sql:', sql);
          winston.error(err);
          reject(err);
        }

        resolve(result);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          winston.error('Error, running, sql:', sql);
          winston.error(err);
          reject(err);
        }

        resolve(rows);
      });
    });
  }
}

module.exports = AppDAO;
