var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var book = require('./routes/book');
var app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use('/book', book);

// ----------------------------------db connections starts----------------------------

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var dbUrlRemote = 'mongodb://testuserdb:Test1988@ds253871.mlab.com:53871/mean-angular5-books';
//var dbUrlRemote = process.env.MONGOLAB_URI
var dbUrlLocal = 'mongodb://localhost/mean-angular5';

// // connecting local db
// var connection = mongoose.connect(dbUrlLocal, { promiseLibrary: require('bluebird') });
// connection
//     .then(() => console.log('connection successfull'))
//     .catch((err) => console.error(err));


// connecting remote db
var connection = mongoose.connect(dbUrlRemote, { useNewUrlParser: true });
connection
  .then((db) => {
    console.log('connection successfull'+db);
  })
  .catch((err) => {
    console.log('Error on start: ' + err.stack);
    process.exit(1);
  });

// //  connection to remote database not working
// var mongoClient = require('mongodb').MongoClient;
// mongoClient.connect(dbUrlRemote,{ useNewUrlParser: true }, function (err, client) {
//   if (err) throw err;
//   console.log('connection successfull');
//   var db = client.db('mean-angular5-books');

//   db.collection('books').findOne({}, function (findErr, result) {
//     if (findErr) throw findErr;
//     console.log(result.title);
//     client.close();
//   });
// }); 


// ----------------------------------db connections ends----------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;