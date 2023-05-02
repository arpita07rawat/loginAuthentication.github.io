var mysql = require('mysql');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var express = require('express');

var con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'davX'
});
con.connect(function(err){
   if (err){
      throw err;
   }
   else{
      console.log('Database is connected successfully.');
   }
});

var app = express();
app.use(sessions({
   secret: 'svwq2397uy62inu1',
   resave: true,
   saveUninitialized: true
}))

var bodyParser = require('body-parser');
const path = require("path")
app.use(express.static(__dirname + '/public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

app.get("/",function(req,res){
	res.render("login");
})

app.get("/logout", function(req, res) {
   req.session.destroy(() => {
      res.redirect("/");
   });
});
app.get("/inbox",function(req,res){
   sn=req.session;
   var sql = 'SELECT * FROM users WHERE name = ?';
   con.query(sql, [sn.name], function (err, result, fields) {
      if (err) throw err;
      res.render("inbox",{data:result[0]});
   });
})

app.post('/check_login', urlencodedParser, function (req, res) {
   var uid=req.body.uid
   var pass=req.body.pass
   var email=req.body.email
   
   var sql = 'SELECT name,password,email FROM users WHERE name = ? and password = ?';
   con.query(sql, [uid, pass, email], function (err, result, fields) {
      if (err) throw err;
      if(!result.length)
         res.json({msg:"1"})
      else{
         req.session.name = uid;
         res.json({msg:"2"})
      }
      console.log(result);
      });
   })

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})