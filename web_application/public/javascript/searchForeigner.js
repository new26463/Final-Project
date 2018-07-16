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
   document.getElementById("map").innerHTML = "";
   var key = document.getElementById("key").innerHTML;
   console.log(key);
   var promises = [];
   if(document.getElementById("searchByName").checked === true){
      var ref = firebase.database().ref("/foreigners/");
      var arr = new Array;
      arr = no_passport.match(/\S+/g);
      ref.orderByChild("name").equalTo(arr[0]).on("child_added", function(snapshot){
         if(arr.length === 2){
            if(snapshot.val().name === arr[0] && snapshot.val().surname === arr[1] && snapshot.val().midname === ""){
               console.log(snapshot.key);
               var userRef = firebase.database().ref("/foreigners/"+ snapshot.key);
               userRef.once('value').then(function(dataSnapshot){
                  document.getElementById("detail").innerHTML = '<div id="headName"><h4>Passport NO&nbsp : &nbsp '+snapshot.key+'<p></h4><b>Name</b> : ' + dataSnapshot.val().name +' '+dataSnapshot.val().midname+' '+dataSnapshot.val().surname + '&nbsp <br> <b>Nationality</b> : ' + dataSnapshot.val().nationality + '&nbsp <b>Sex</b> : ' + dataSnapshot.val().sex + '&nbsp <b>Date of birth</b> : ' + dataSnapshot.val().date_of_birth + '</div><br>' + '<a href="https://us-central1-rest-service-7412a.cloudfunctions.net/restService/?no=' + snapshot.key + '&key=' + key + '" target="_blank" class="btn btn-info" role="button">' + ' Personal profile ' + '<br>';
                  //table data
                  var latitude = new Array() , latObj = {};
                  var divTable = document.getElementById('table');
                  var tbl = document.createElement('table');
                  var tbdy = document.createElement('tbody');
                  tbl.innerHTML = '<thead><tr><th scope="col">Hotel Name</th><th scope="col">Address</th><th scope="col">Check In</th><th scope="col">Check Out</th></tr></thead>';
                  tbl.className += 'table table-dark';
                  for(let k = 0; k < dataSnapshot.val().booking.length; k++){
                     let hotel = firebase.database().ref("/hotels/"+ dataSnapshot.val().booking[k].hotel_id);
                     hotel.on('value', function(dataHotel){
                        var row = document.createElement('tr');
                        var cell = document.createElement( "td" );
                        var cellText;
                        latObj = {
                           lat : dataHotel.val().address.latitude,
                           lng : dataHotel.val().address.longitude,
                           name : dataHotel.val().hotel_name
                        }
                        latitude.push(latObj);
                        for(let i = 0; i < dataSnapshot.val().booking.length; i++){
                           var row = document.createElement('tr');
                           for(let j = 0; j <= 3; j++) {
                              var cell = document.createElement( "td" );
                              var cellText;
                              switch (j) {
                                 case 0 : cellText = document.createTextNode( k+1 + '.' + ' ' +dataHotel.val().hotel_name);
                                 break;
                                 case 1 : cellText = document.createTextNode(dataHotel.val().address.district + ' ' +dataHotel.val().address.province);
                                 break;
                                 case 2 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_in);
                                 break;
                                 case 3 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_out);
                                 break;
                                 default:
                              }
                              cell.appendChild(cellText);
                              row.appendChild(cell);
                           }
                        }
                        tbdy.appendChild(row);
                        tbl.appendChild(tbdy);
                        divTable.appendChild(tbl);
                        initMap(latitude);
                     })
                  }
               })
               document.getElementById("search").value="";
            }else{
               document.getElementById("detail").innerHTML = '<div><h4>No information available</h4></div><br>';
               console.log('No information available.');
            }
         }else if(arr.length === 3){
            if(snapshot.val().name === arr[0] && snapshot.val().midname === arr[1] && snapshot.val().surname === arr[2] && arr.length == 3){
               console.log(snapshot.key);
               var userRef = firebase.database().ref("/foreigners/"+ snapshot.key);
               userRef.once('value').then(function(dataSnapshot){
                  document.getElementById("detail").innerHTML = '<div id="headName"><h4>Passport NO&nbsp : &nbsp '+snapshot.key+'<p></h4><b>Name</b> : ' + dataSnapshot.val().name +' '+dataSnapshot.val().midname+' '+dataSnapshot.val().surname + '&nbsp <br> <b>Nationality</b> : ' + dataSnapshot.val().nationality + '&nbsp <b>Sex</b> : ' + dataSnapshot.val().sex + '&nbsp <b>Date of birth</b> : ' + dataSnapshot.val().date_of_birth + '</div><br>' + '<a href="https://us-central1-rest-service-7412a.cloudfunctions.net/restService/?no=' + snapshot.key + '&key=' + key + '" target="_blank" class="btn btn-info" role="button">' + ' Personal profile ' + '<br>';
                  //table data
                  var latitude = new Array() , latObj = {};
                  var divTable = document.getElementById('table');
                  var tbl = document.createElement('table');
                  var tbdy = document.createElement('tbody');
                  tbl.innerHTML = '<thead><tr><th scope="col">Hotel Name</th><th scope="col">Address</th><th scope="col">Check In</th><th scope="col">Check Out</th></tr></thead>';
                  tbl.className += 'table table-dark';
                  for(let k = 0; k < dataSnapshot.val().booking.length; k++){
                     let hotel = firebase.database().ref("/hotels/"+ dataSnapshot.val().booking[k].hotel_id);
                     hotel.on('value', function(dataHotel){
                        var row = document.createElement('tr');
                        var cell = document.createElement( "td" );
                        var cellText;
                        latObj = {
                           lat : dataHotel.val().address.latitude,
                           lng : dataHotel.val().address.longitude,
                           name : dataHotel.val().hotel_name
                        }
                        latitude.push(latObj);
                        for(let i = 0; i < dataSnapshot.val().booking.length; i++){
                           var row = document.createElement('tr');
                           for(let j = 0; j <= 3; j++) {
                              var cell = document.createElement( "td" );
                              var cellText;
                              switch (j) {
                                 case 0 : cellText = document.createTextNode(k+1 + '.' + ' ' + dataHotel.val().hotel_name);
                                 break;
                                 case 1 : cellText = document.createTextNode(dataHotel.val().address.district + ' ' +dataHotel.val().address.province);
                                 break;
                                 case 2 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_in);
                                 break;
                                 case 3 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_out);
                                 break;
                                 default:
                              }
                              cell.appendChild(cellText);
                              row.appendChild(cell);
                           }
                        }
                        tbdy.appendChild(row);
                        tbl.appendChild(tbdy);
                        divTable.appendChild(tbl);
                        initMap(latitude);
                     })
                  }
               })
               document.getElementById("search").value="";
            }else{
               document.getElementById("detail").innerHTML = '<div><h4>No information available</h4></div><br>';
               console.log('No information available.');
            }
         }
      })
   }else if(document.getElementById("searchByNoPassport").checked === true){
      if(document.getElementById("search").value.length==9){
         var ref = firebase.database().ref("/foreigners/"+ no_passport);
         ref.once('value').then(function(dataSnapshot){
            //check data ว่ามีไหม
            if(dataSnapshot.hasChildren()){
               document.getElementById("detail").innerHTML = '<div id="headName"><h4>Passport NO&nbsp : &nbsp '+no_passport+'<p></h4><b>Name</b> : ' + dataSnapshot.val().name +' '+dataSnapshot.val().midname+' '+dataSnapshot.val().surname + '&nbsp <br> <b>Nationality</b> : ' + dataSnapshot.val().nationality + '&nbsp <b>Sex</b> : ' + dataSnapshot.val().sex + '&nbsp <b>Date of birth</b> : ' + dataSnapshot.val().date_of_birth + '</div><br>' + '<a href="https://us-central1-rest-service-7412a.cloudfunctions.net/restService/?no=' + no_passport + '&key=' + key + '" target="_blank" class="btn btn-info" role="button">' + ' Personal profile ' + '<br>';
               //table data
               var latitude = new Array() , latObj = {};
               var divTable = document.getElementById('table');
               var tbl = document.createElement('table');
               var tbdy = document.createElement('tbody');
               tbl.innerHTML = '<thead><tr><th scope="col">Hotel Name</th><th scope="col">Address</th><th scope="col">Check In</th><th scope="col">Check Out</th></tr></thead>';
               tbl.className += 'table table-dark';
               for(let k = 0; k < dataSnapshot.val().booking.length; k++){
                  let hotel = firebase.database().ref("/hotels/"+ dataSnapshot.val().booking[k].hotel_id);
                  hotel.on('value', function(dataHotel){
                     // console.log('k = ' + k);
                     if(dataSnapshot.val().booking.length==1){
                        var row = document.createElement('tr');
                        var cell = document.createElement( "td" );
                        var cellText;
                        latObj = {
                           lat : dataHotel.val().address.latitude,
                           lng : dataHotel.val().address.longitude,
                           name : dataHotel.val().hotel_name
                        }
                        latitude.push(latObj);
                        // console.log(latObj);
                        // console.log(latitude);
                        for(let i = 0; i < dataSnapshot.val().booking.length-(dataSnapshot.val().booking.length-1); i++){
                           var row = document.createElement('tr');
                           for(let j = 0; j <= 3; j++) {
                              var cell = document.createElement( "td" );
                              var cellText;
                              switch (j) {
                                 case 0 : cellText = document.createTextNode(k+1 + '.' + ' ' + dataHotel.val().hotel_name);
                                 break;
                                 case 1 : cellText = document.createTextNode(dataHotel.val().address.district + ' ' +dataHotel.val().address.province);
                                 break;
                                 case 2 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_in);
                                 break;
                                 case 3 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_out);
                                 break;
                                 default:
                              }
                              cell.appendChild(cellText);
                              row.appendChild(cell);
                           }
                        }
                        tbdy.appendChild(row);
                        tbl.appendChild(tbdy);
                        divTable.appendChild(tbl);
                        initMap(latitude);
                     }else{
                        for(let i = 0; i < dataSnapshot.val().booking.length-(dataSnapshot.val().booking.length-1); i++){
                           var row = document.createElement('tr');
                           latObj = {
                              lat : dataHotel.val().address.latitude,
                              lng : dataHotel.val().address.longitude,
                              name : dataHotel.val().hotel_name
                           }
                           latitude.push(latObj);
                           // console.log("i = " + i);
                           for(let j = 0; j <= 3; j++) {
                              var cell = document.createElement( "td" );
                              var cellText;
                              // console.log("j = " + j);
                              switch (j) {
                                 case 0 : cellText = document.createTextNode(k+1 + '.' + ' ' + dataHotel.val().hotel_name);
                                 break;
                                 case 1 : cellText = document.createTextNode(dataHotel.val().address.district + ' ' +dataHotel.val().address.province);
                                 break;
                                 case 2 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_in);
                                 break;
                                 case 3 : cellText = document.createTextNode(dataSnapshot.val().booking[k].check_out);
                                 break;
                                 default: break;
                              }
                              cell.appendChild(cellText);
                              row.appendChild(cell);
                           }
                        }
                        tbdy.appendChild(row);
                        tbl.appendChild(tbdy);
                        divTable.appendChild(tbl);
                        initMap(latitude)
                     }
                  })
               }
            }else{
               document.getElementById("detail").innerHTML = '<div><h4>No information available</h4></div><br>';
               console.log('No information available.');
            }
         });
         document.getElementById("search").value="";
      }else{
         alert('กรุณากรอกข้อมูลให้ครบ');
      }
   }
   //เช็คว่าใส่ข้อมูลครบหรือไม่
}

function initMap(locate) {
   let count=0;
   var mapOptions = {
      zoom: 5.4,
      center: new google.maps.LatLng(13.736717,100.523186),
      mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   var map = new google.maps.Map(document.getElementById('map'),mapOptions);
   var infoWindow = new google.maps.InfoWindow({});
   var data = [],path = [],markers;
   for (let i = 0 ; i < locate.length; i++) {
      if(count===i){
         count+=1;
         data [i] = locate[i];
         // var myLatlng = new google.maps.LatLng(data[i].lng, data[i].lat);
         // console.log(data[i].lat + ' ' + data[i].lng);
         console.log(locate[i].lat + ' ' + locate[i].lng);

         markers = new google.maps.Marker({
            position: new google.maps.LatLng(locate[i].lng, locate[i].lat),
            map: map,
            // icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+count+'|FE6256|000000',
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+count+'|FE6256|000000',

            animation: google.maps.Animation.DROP,
            title: locate[i].name
         });
         path.push(markers.position)
         google.maps.event.addListener(markers, "click", (function(markers,i) {
            return function (){
               infoWindow.setContent(i+1 + '.' + locate[i].name);
               infoWindow.open(map, markers);
            }
         })(markers,i));
      }
   }
   var flightPath = new google.maps.Polyline({
      path: path,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
   });
   flightPath.setMap(map);
}

//พิมได้แต่เลข กับ อักษร 2ตัว
function validate(e) {
 var theEvent = e || window.event;
 var key = theEvent.keyCode || theEvent.which;
 key = String.fromCharCode( key );
 var regex = /[A-Z]|[0-9]|[" "]/;
 if( !regex.test(key) ) {
   theEvent.returnValue = false;
   if(theEvent.preventDefault)
      theEvent.preventDefault();
 }
}
