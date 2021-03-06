var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var md5 = require('MD5');
var rest = require('./REST.js');
var app = express();

//constructor
function REST(){
    var self = this;
    self.connectMysql();
}

//connect to mysql database
REST.prototype.connectMysql = function () {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit : 100,
        host : 'localhost',
        user: 'root',
        password: '',
        database : 'restful_api_demo',
        debug: false
    });

    pool.getConnection(function (err,connection) {
        if(err){
            self.stop(err);
        }else{
            self.configureExpress(connection);
        }
    });
}

//configure express framework middleware
REST.prototype.configureExpress = function(connection){
    var self = this;
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api',router);
    var rest_router = new rest(router,connection,md5);
    self.startServer();
}

//start Node server
REST.prototype.startServer = function() {
    app.listen(3000,function(){
        console.log("All right ! I am alive at Port 3000.");
    });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

//initialize constructor
new REST();