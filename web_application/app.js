const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const app     = express();
const path    = require("path");
const admin = require("firebase-admin");
const firebase = require('firebase');
const serviceAccount = require("./rest-service-7412a.json");
// const firebase = require("firebase/app");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rest-service-7412a.firebaseio.com"
});

const db = admin.database();

app.use(session({
   secret : 'NonNhaiNaJaHaHaHokHok',
   resave : true,
   saveUninitialized : false
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

var ref ;
var sess;

app.get('/', (req,res)=>{
   sess = req.session;
   if(sess.email){
      res.redirect('/index');
   }else{
      res.redirect('/login');
   }
});

app.post('/index', (req,res)=>{
   req.session.destroy();
   console.log(req.session);
   res.redirect('/');
})

app.get('/index', (req,res)=>{
   sess = req.session
   if(sess.token){
      if(sess.status==0){
         res.render('homeTM',{
            layout:false,
            name : sess.name,
            surname : sess.surname,
            key : sess.key
         });
      }else if(sess.status==1){
         res.render('homeStaff',{
            layout:false,
            name : sess.name,
            surname : sess.surname,
            key : sess.key
         });
      }
   }
   else{
      return res.redirect('/');
   }
})

app.get('/login', (req,res)=>{
   // เอาโทเคนจากฟอนมาแปลงในแบลค
   sess = req.session
   var idToken = req.headers.authorization
   if(idToken!=undefined){
      sess.token = req.headers.authorization
   }
   if(sess.token){
      admin.auth().verifyIdToken(sess.token)
      .then((decodedToken)=> {
         sess.key = decodedToken.uid;
         sess.email = decodedToken.email
         // console.log(sess)
         if(sess.key!=undefined){
            var ref = db.ref("/users/" + sess.key)
            ref.once("value", function(snapshot) {
               sess.name = snapshot.val().name;
               sess.surname = snapshot.val().surname;
               sess.status = snapshot.val().status;
               return res.redirect(302,'/index');
            })
         }
      })
   }else if(!sess.token){
      res.render('login');
   }
})

app.get('/register', (req,res)=>{
   res.render('register');
});


app.listen(3000);
console.log("Running at Port 3000");
