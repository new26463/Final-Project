const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var express = require('express');
const app = express();

app.get('/', (req,res) => {
   var no = req.query.no
   var key = req.query.key
   var db = admin.database().ref("/foreigners/" + no)
   let obj = {} , finalDataHotel , finalDataUser , allFinalData , promises = [] ,Foreigner , Booking = [] , allData;
   admin.database().ref("/users/" + key).once('value').then((dataTM)=>{
      if(dataTM.val().status === "0"){
         db.once('value').then((snapshot)=>{
            res.contentType('application/json');
            Foreigner = {
               passportID : no,
               name : snapshot.val().name,
               midname : snapshot.val().midname,
               surname : snapshot.val().surname,
               nationality : snapshot.val().nationality,
               sex : snapshot.val().sex,
               dateOfBirth : snapshot.val().date_of_birth,
               dateOfExpiry : snapshot.val().date_of_expiry
            }
            for(let i = 0; i < snapshot.val().booking.length; i++) {
               admin.database().ref("/hotels/" + snapshot.val().booking[i].hotel_id).once('value').then((dataHotel)=>{
                  finalDataHotel = {
                     address : {
                        district : dataHotel.val().address.district,
                        houseNo : dataHotel.val().address.house_no,
                        alley : dataHotel.val().address.alley,
                        latitude : dataHotel.val().address.latitude,
                        longitude : dataHotel.val().address.longitude,
                        postalCode : dataHotel.val().address.postal_code,
                        province : dataHotel.val().address.province,
                        villageNo : dataHotel.val().address.village_no,
                        street : dataHotel.val().address.street
                     },
                     hotelName : dataHotel.val().hotel_name
                  }
                  admin.database().ref("/users/" + snapshot.val().booking[i].hotel_staff_in).once('value').then((dataUser)=>{
                     finalDataUser = {
                        staffEmail : dataUser.val().email,
                        staffName : dataUser.val().name,
                        staffSurname : dataUser.val().surname
                     }
                     allData = {
                        address : {
                           district : finalDataHotel.address.district,
                           houseNo : finalDataHotel.address.houseNo,
                           alley : finalDataHotel.address.alley,
                           latitude : finalDataHotel.address.latitude,
                           longitude : finalDataHotel.address.longitude,
                           postalCode : finalDataHotel.address.postalCode,
                           province : finalDataHotel.address.province,
                           villageNo : finalDataHotel.address.villageNo,
                           street : finalDataHotel.address.street
                        },
                        hotelName : finalDataHotel.hotelName,
                        staffEmail : dataUser.val().email,
                        staffName : dataUser.val().name,
                        staffSurname : dataUser.val().surname
                     }
                     Booking.push(allData)
                  })
               })
               promises.push(admin.database().ref("/hotels/" + snapshot.val().booking[i].hotel_id).once('value'))
               promises.push(admin.database().ref("/users/" + snapshot.val().booking[i].hotel_staff_in).once('value'))
            }
            Promise.all(promises).then((ress)=>{
               obj = {
                  Booking,
                  Foreigner
               }
               JSON.stringify(obj);
               setTimeout(function () {
                  res.send(obj)
              }, 800)
            })
         })
      }else{
         res.send('ERROR 404 NOT FOULD')
      }
   })
})

app.get('/hotel', (req,res) => {
   var no = req.query.no;
   var key = req.query.key;
   var hotelId = req.query.hotelId;
   let count = 0;
   var dataUser,dataStaff,promises = [],dataForeigner=[],obj = {};
   var checkIn = new Array() , checkOut = new Array() ;
   admin.database().ref("/foreigners/" + no).once('value').then((snapshot)=>{
      res.contentType('application/json');
      foreigner = {
         passportID : no,
         name : snapshot.val().name,
         midname : snapshot.val().midname,
         surname : snapshot.val().surname,
         nationality : snapshot.val().nationality,
         // date_of_birth : snapshot.val().date_of_birth,
         // date_of_expiry : snapshot.val().date_of_expiry,
         sex : snapshot.val().sex
      }
      for(let i = 0; i < snapshot.val().booking.length; i++) {
         if(snapshot.val().booking[i].hotel_staff_in === key){
            checkIn[count] = snapshot.val().booking[i].check_in;
            checkOut[count] = snapshot.val().booking[i].check_out;
         }
         count ++
      }
      if(checkIn[0] === null && checkOut[0] === null){
         res.send("No details of the guests.")
      }else{
         admin.database().ref("/users/" + key).once("value",(data)=>{
               // if(snapshot.val().booking[i].hotel_staff_in === key){
               //    admin.database().ref("/users/" + snapshot.val().booking[i].hotel_staff_out).once('value',(staffOut)=>{
               //       if(data.val().hotel_id === hotelId){
               //          console.log(i);
               //          dataStaff = {
               //             checkIn_time : checkIn[i],
               //             checkIn_staffName : data.val().name,
               //             checkIn_staffSurname : data.val().surname,
               //             checkIn_staffEmail : data.val().email,
               //             checkOut_time : checkOut[i],
               //             checkOut_staffName : staffOut.val().name,
               //             checkOut_staffSurname : staffOut.val().surname,
               //             checkOut_staffEmail : staffOut.val().email
               //          }
               //          dataForeigner.push(dataStaff)
               //       }
               //    })

            for(let i = 0 ; i < snapshot.val().booking.length ; i++){
               if((snapshot.val().booking[i].hotel_id === hotelId)&&(data.val().hotel_id === hotelId)){
                  admin.database().ref("/users/"+ snapshot.val().booking[i].hotel_staff_in).once('value',(staffin)=>{
                     if(snapshot.val().booking[i].hotel_staff_out === 'empt'){
                        console.log(i);
                        dataStaff = {
                           checkIn_time : snapshot.val().booking[i].check_in,
                           checkIn_staffName : staffin.val().name,
                           checkIn_staffSurname : staffin.val().surname,
                           checkIn_staffEmail : staffin.val().email,
                           checkOut_time : snapshot.val().booking[i].check_out,
                           checkOut_staffName : 'empt',
                           checkOut_staffSurname : 'empt',
                           checkOut_staffEmail : 'empt'
                        }
                        dataForeigner.push(dataStaff)
                     }else{
                        admin.database().ref("/users/"+ snapshot.val().booking[i].hotel_staff_out).once('value',(staffOut)=>{
                           console.log(i);
                           dataStaff = {
                              checkIn_time : snapshot.val().booking[i].check_in,
                              checkIn_staffName : staffin.val().name,
                              checkIn_staffSurname : staffin.val().surname,
                              checkIn_staffEmail : staffin.val().email,
                              checkOut_time : snapshot.val().booking[i].check_out,
                              checkOut_staffName : staffOut.val().name,
                              checkOut_staffSurname : staffOut.val().surname,
                              checkOut_staffEmail : staffOut.val().email
                           }
                           dataForeigner.push(dataStaff)
                        })
                     }
                  })
                  promises.push(admin.database().ref("/foreigners/" + no).once('value'))
                  promises.push(admin.database().ref("/users/" + snapshot.val().booking[i].hotel_staff_in).once('value'))
                  promises.push(admin.database().ref("/users/" + snapshot.val().booking[i].hotel_staff_out).once('value'))
               }
            }
            Promise.all(promises).then((ress)=>{
               obj = {
                  foreigner,
                  dataForeigner
               }
               JSON.stringify(obj);
               setTimeout(function () {
                  res.send(obj)
               }, 400)
            })
         })
      }
   })
})


exports.restService = functions.https.onRequest(app);
