// ของเก่าล่าสุด ใช้้งานได้

// function signIn(){
//    var email = document.getElementById('userEmail').value;
//    var password = document.getElementById('userPassword').value;
//    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error){
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       if(errorCode === 'auth/wrong-password'){
//          alert('Email or password is invalid Please check again.');
//       }else {
//          alert(errorMessage);
//       }
//       console.log(error);
//    }).then(function(checkVerify){
//          firebase.auth().onAuthStateChanged(firebaseUser =>{
//             if(firebaseUser.emailVerified){
//                var ref = firebase.database().ref("/users/").orderByChild("email").equalTo(email).once("value",dataSnapshot => {
//                   var snap = dataSnapshot.val();
//                   var key = Object.keys(snap)[0];
//                   if(snap[key].email == email && snap[key].password == password && firebaseUser.emailVerified!=false){
//                      window.location = '/';
//                      console.log(firebaseUser.emailVerified);
//                      console.log('email is verified');
//                   }
//                });
//             }else if(firebaseUser.emailVerified==false){
//                console.log(firebaseUser.emailVerified);
//                console.log('email is not verified');
//             }
//          })
//    });
// }

// function signIn(){
//    var email = document.getElementById('userEmail').value;
//    var password = document.getElementById('userPassword').value;
//    var uid;
//    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
//       console.log('Error while authenticating:', error);
//    }).then(loginObject => {
//       if (loginObject) {
//          console.log('Success!!');
//          console.log(loginObject.uid);
//          uid = loginObject.uid;
//          // now do your thing!
//          var something = firebase.database().ref('users/' + loginObject.uid );
//          console.log(something);
//          // do something with something
//       } else {
//          console.log('Oops, something went wrong while authenticating:', loginObject);
//       }
//    });
// }
