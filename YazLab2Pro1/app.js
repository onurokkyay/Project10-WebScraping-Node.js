var fs = require('fs');
var path = require ('path');
var express= require('express');
var app = express();
var bodyParser = require('body-parser');

app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'/app_server/views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({extended:false}));

var routeMainpage = require('./app_server/routes/MainpageRoute')

app.use('/', routeMainpage)
app.listen(8000)