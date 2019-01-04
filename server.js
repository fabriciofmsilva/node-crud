const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/crud-nodejs';

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(err);
  }

  db = client.db('crud-nodejs');

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.render('index.ejs');
});

app.get('/', (req, res) => {
  let cursor = db.collection('data').find();
});

app.route('/show')
  .get((req, res) => {
    db.collection('data').find().toArray((err, results) => {
      if (err) {
        return console.log(err);
      }

      res.render('show.ejs', { data: results });
    });
  })
  .post((req, res) => {
    db.collection('data').save(req.body, (err, result) => {
      if (err) {
        return console.log(err);
      }

      console.log(`Saved into the database: ${result}`);
      res.redirect('/show');
    });
  });

app.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
      if (err) {
        return console.log(err);
      }

      res.render('edit.ejs', { data: result });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    const { name, surname } = req.body;

    db.collection('data').updateOne({
      _id: ObjectId(id)
    }, {
      $set: {
        name,
        surname,
      }
    }, (err, result) => {
      if (err) {
        return console.log(err);
      }

      res.redirect('/show');
      console.log(`Updated into the database: ${result}`);
    })
  });

app.route('/delete/:id')
  .get((req, res) => {
    const id = req.params.id;
    
  });