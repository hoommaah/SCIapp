'use strict'

var dotenv = require('dotenv');
dotenv.config();
var db = require('./db');
var express = require('express');
var	lodash = require('lodash');
var	app = express();
var	router = express.Router();
var repl = require('repl');
app.use(router);
var	port = process.env.APP_PORT;
var requireDirectory = require('require-directory');
// module.exports = requireDirectory(module);

var bodyParser = require('body-parser')
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var server = app.listen(port, function(){
	console.log('Listening to %s', port);
  var local = repl.start("invoice> ");
});


var knex = require('knex')({
    client: 'postgresql',
    connection: {
      database: process.env.APP_DATABASE,
			user: process.env.APP_NAME,
			password: process.env.APP_PASSWORD,
			charset: process.env.APP_CHARSET
    }
});

var bookshelf = require('bookshelf')(knex);

global.Invoice = bookshelf.Model.extend({
	tableName: 'invoices'
});



router.route('/invoices')
	.post(function (req, res){
      new Invoice({
      amount: req.body.amount,
      callback: req.body.callback
    }).save().then(function(newRow) {
        return(newRow.id);
    }).catch(function(err) {
        res.send('created!');
    });
	});


router.route('/invoices/:id')
	.get(function (req, res){
		Invoice.forge({id:req.params.id}).fetch()
			.then(function(i) {
				if (!i) {
					console.log('User with id: ', req.params.id, ' not found!');
					res.send('Cannot find invoice');
				}	else {

					res.json(i);
				}
			})
			.catch(function(res) {
				console.log('Error encountered!');
			})
	})

	.put(function (req, res){
		Invoice.forge({id:req.params.id}).fetch()
			.then(function(i) {
				if (!i) {
					console.log('User with id: ', id, ' not found!');
				} else {
					Invoice.save({
					})
				}
			})
	});

router.route('/invoicesdelete/:id')
	.get(function (req, res){
    var x = req.params.id;
    let invoice = new Invoice({id: x});
    invoice.fetch().then(function(inv) {
      return inv.destroy();
    })
    .then(function() {
      res.send("Ok");
    })
    // console.log(invoice);
    // invoice.destroy().then(function(){
    //   res.send('ok');
    // })

    // new Invoice({
    //   'id': x
    // }).where({
    //   'id' : x
    // }).fetch().then(function(fetchedModel) {
    //     fetchedModel.destroy();
    // }).catch(function(err) { });
		// Invoice.forge({id:req.params.id}).fetch({require: true})
		// 	.then(function(i) {
    //   //  new invoice({id: })
    //     // var x = i.get('id');
    //     // return knex.raw('DELETE FROM invoices where id=' + x + ';' );
    //     return
		// 		//console.log('Successfully delete invoice with id: ', i.get('id'));
		// })
		// 	.catch(function(res) {
		// 		console.log('Error encountered!');
    //     res.send('cannot find id');
		// 	})
	});
