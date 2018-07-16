function saveUser(){
   var name = document.getElementById('regisName');
   var surname = document.getElementById('regisSurname');
   var email = document.getElementById('regisEmail');
   var password = document.getElementById('regisPassword');
   var hotelId = document.getElementById('regisHotelID');
   var hotelName = document.getElementById('regisHotelName');
   var status = document.getElementById('regisStatus');
   insertUser(regisName.value, regisSurname.value, regisEmail.value, regisPassword.value, regisHotelID.value, regisHotelName.value, regisStatus.value)
}

function insertUser(name, surname, email, password, hotelId, hotelName, status){
   var firebaseRef = firebase.database().ref("users/");
   firebaseRef.push({
      name : name,
      surname : surname,
      email : email,
      password : password,
      hotel_id : hotelId,
      hotel : hotelName,
      status : status
   });
   console.log('insert success');
   signUp();
}

function signUp(){
   var email = document.getElementById('regisEmail').value;
   var password = document.getElementById('regisPassword').value;
   firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error){
      var errorCode = error.code;
      var errorMessage = error.message;
      if(errorCode === 'auth/weak-password'){
         alert('password weak');
      }else {
         alert(errorMessage);
      }
      console.log(error);
   }).then(function (sendEmailVerify){
         if(sendEmailVerify === false){
            return false;
         }else{
            firebase.auth().currentUser.sendEmailVerification();
            alert('ส่งเมลแล้ว');
            return true;
         }
      });
}
