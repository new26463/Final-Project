window.onload = function(){
   //ใช้ปุ่ม enter ในการหาได้
   document.getElementById("search").addEventListener("keyup", function(event) {
   // event.preventDefault();
   if (event.keyCode === 13) {
        document.getElementById("b_search").click();
     }
   });
}

function clickFunction(){
   var no_passport = document.getElementById("search").value;
   document.getElementById("detail").innerHTML = "";
   document.getElementById("table").innerHTML = "";
   var key = document.getElementById("key").innerHTML;
   console.log(key);
   //เช็คว่าใส่ข้อมูลครบหรือไม่
   if(document.getElementById("search").value.length==9){
      var ref = firebase.database().ref("/foreigners/"+ no_passport);
      ref.once('value').then(function(dataSnapshot){
         //check data ว่ามีไหม
         if(dataSnapshot.hasChildren()){
            document.getElementById("detail").innerHTML = '<div id="headName" class="text-center"><h4>Passport NO&nbsp : &nbsp ' + no_passport + '</h4><b>Name</b> : ' + dataSnapshot.val().name + ' ' + dataSnapshot.val().midname + ' ' + dataSnapshot.val().surname + '</div><br>';
            console.log(dataSnapshot.val());
            console.log(dataSnapshot.val().booking.length);
            //table data
            var divTable = document.getElementById('table');
            var tbl = document.createElement('table');
            tbl.innerHTML = '<thead><tr><th scope="col">Information of foreigners</th></tr></thead>';
            tbl.className += 'table table-dark text-center';
            var tbdy = document.createElement('tbody');
            // tbdy.innerHTML = '<tr><td>' + '<a href="https://us-central1-rest-service-7412a.cloudfunctions.net/restService/?PN=' + no_passport + '&KEY=' + key + '" target="_blank" class="btn btn-info" role="button">' + ' Personal profile ' +'</td></tr>';
            tbdy.innerHTML = '<tr><td>' + '<form method="post"><a href="https://us-central1-rest-service-7412a.cloudfunctions.net/restService/hotel?no=' + no_passport + '&key=' + key + '" target="_blank" class="btn btn-info" role="button">' + ' Personal profile ' +'</form></td></tr>';
            tbl.appendChild(tbdy);
            divTable.appendChild(tbl)
         }else{
            document.getElementById("detail").innerHTML = '<div class="text-center"><h4>No information available</h4></div>'
            console.log('No information available.');
         }
      });
      document.getElementById("search").value="";
   }else{
      alert('กรุณากรอกข้อมูลให้ครบ');
   }
}

//พิมได้แต่เลข
function validate(e) {
 var theEvent = e || window.event;
 var key = theEvent.keyCode || theEvent.which;
 key = String.fromCharCode( key );
 var regex = /[A-Z]|[0-9]|\./;
 if( !regex.test(key) ) {
   theEvent.returnValue = false;
   if(theEvent.preventDefault)
      theEvent.preventDefault();
 }
}
