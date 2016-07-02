angular.module('starter.controllers', [])

.controller('LoaderCtrl', function($scope, $ionicPopup, $state,panicService,$cordovaFile) {
 
    document.addEventListener('deviceready', function () {

      var fileName = "panic_cache_1.txt";

      $cordovaFile.checkFile(cordova.file.dataDirectory, fileName)
        .then(function (success) {
           $cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
            .then(function (success) {
              $state.go('main');  
              // $state.go('register');
            }, function (error) {
              $state.go('register');  
            });

        }, function (error) {
          $state.go('register');  
        });
    });

})
.controller('RegisterCtrl', function($scope, $ionicPopup, $state,panicService,$cordovaFile,$cordovaCamera) {
 
    var fileName = "panic_cache_1.txt";
    
    $scope.data = {};
 
    $scope.data.user = '';// = myservice.username;
    $scope.data.password = '';//= myservice.password;

    $scope.data.name = '';
    $scope.data.surname = '';
    $scope.data.phone = '';
    $scope.data.address = '';
    $scope.data.direction = '';
    $scope.data.photo = 'img/ph.png';

    $scope.register = function() {

        if($scope.data.name == '')
        {
          $scope.showAlert('Error','Please provide a name');
          return;
        }
        if($scope.data.surname == '')
        {
          $scope.showAlert('Error','Please provide a surname');
          return;
        }
        if($scope.data.phone == '')
        {
          $scope.showAlert('Error','Please provide a phone number');
          return;
        }
        if($scope.data.address == '')
        {
          $scope.showAlert('Error','Please provide a address');
          return;
        }
        if($scope.data.direction == '')
        {
          $scope.showAlert('Error','Please provide a direction');
          return;
        }
        if($scope.data.photo == 'img/ph.png')
        {
          $scope.showAlert('Error','Please provide a photo');
          return;
        }

        var uuid = device.uuid;
        $scope.data.uuid = uuid;

        try{
            panicService.register($scope.data).success(function(data) {

              $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, uuid, true)
                .then(function (success) {
                  $scope.alertPopup.close();
                  $state.go('main'); 
                }, function (error) {
                  $scope.showAlert('Error','Could not write file.');
                });
            }).error(function(x,y,z)
            {
              $scope.showAlert('Error','Could not register');
            });
            $scope.showAlert('Registering','Please Wait');
      }catch(err)
      {
        alert(err);
      }
    }

    $scope.takePhoto = function()
    {
      var options = {
          quality: 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 200,
          targetHeight: 200,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };

          $cordovaCamera.getPicture(options).then(function (imageData) {
              $scope.data.photo = "data:image/jpeg;base64," + imageData;
          }, function (err) {
              // An error occured. Show a message to the user
          });

    }

      $scope.showAlert = function(title,msg) {
          $scope.alertPopup = $ionicPopup.alert({
           title: title,
           template: msg
         });
       };

})
.controller('MainCtrl', function($scope, $ionicPopup, $state,panicService,$cordovaGeolocation,$cordovaFile) {
   
  var uuid = device.uuid;

  $scope.alarm = {};
  $scope.alarm.alarmDate = new Date();  
  $scope.alarm.closeDate = '';  
  $scope.alarm.uuid = uuid;  
  $scope.alarm.gpsLat = '0';  
  $scope.alarm.gpsLon = '0';  
  $scope.currAlarmState = '';  

  $scope.lat = 0;
  $scope.long = 0;
  $scope.btnLabel = "HOLD TO<br>PANIC";

  $scope.hasPanicked = false;
   $scope.panic = function()
   {
    if($scope.hasPanicked)
    {
      return;
    }
    $scope.hasPanicked = true;
    setTimeout(function(){
          $scope.hasPanicked = false;
      }, 5000);

      $scope.sendingPanic = true;
      $scope.gpsEnabled(function(enabled)
      {
          if(enabled)
          {
            // $scope.showAlert('Info','Sending Panic');
            $scope.btnLabel = "SENDING PANIC";
            $scope.getGps(function(lat,long){
                if(lat != false)
                {

                  $scope.alarm.gpsLat = lat;
                  $scope.alarm.gpsLon = long;
                  panicService.panic($scope.alarm).success(function(data) {
                      // $scope.showAlert('Panic Response',data.message);
                      $scope.currAlarmId = data.alarm;
                      $scope.currAlarmState = 'open';
                      $scope.stateLoop(1000);
                      $scope.btnLabel = data.message.toUpperCase();
                      $scope.sendingPanic = false;
                      navigator.vibrate(2000);
                  }).error(function(data,status,headers,config)
                  {
                      $scope.showAlert('Error','Could not Create alarm. Make sure you have internet connection.');
                      $scope.btnLabel = "HOLD TO<br>PANIC";
                      $scope.progress = 0;
                      $scope.hasPanicked = false;
                      $scope.sendingPanic = false;
                  });
                }
            })
          }else
          {
            $scope.showAlert('Error','Please enable GPS services');
            $scope.btnLabel = "HOLD TO<br>PANIC";
            $scope.progress = 0;
            $scope.hasPanicked = false;
            $scope.sendingPanic = false;
          }
      })
   }


   $scope.gpsEnabled = function(cb)
   {
      CheckGPS.check(function win(){
        cb(true);
      },
      function fail(){
        cb(false); 
      });
   };

  function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

   $scope.getGps = function(cb)
   {
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            $scope.lat = lat;
            $scope.long = long;
            
            panicService.getMap(lat,long,$scope.mapWidth,$scope.mapHeight).then(function(data) {

              $scope.map = _arrayBufferToBase64(data.data);
              var saveData = {};
              saveData.lat = lat;
              saveData.long = long;
              saveData.map = $scope.map;

              try{
                $cordovaFile.writeFile(cordova.file.dataDirectory, 'map.dat', saveData, true)
                .then(function (success) {

                }, function (error) {

                });
              }catch(err)
              {
                alert(err);
              }


              
            });

            if(typeof cb != 'undefined')
              cb(lat,long);

        }, function(err) {
            // alert(JSON.stringify(err));
            console.log(err);
            if(typeof cb != 'undefined')
              cb(false)
        });
   }

   $scope.setProgress = function(progress)
   {
      console.log('setProgress ' + progress);
      var grad = 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(255,0,0,1) ' + progress + '%, rgba(255,255,255,0) '+(progress+1)+'%)';
      if(progress == 0)
      {
        grad = '';
      }
      return { "background-image": grad}
   }

   $scope.isMouseDown = false;
   $scope.progress = 0;
   $scope.sendingPanic = false;
   $scope.mouseDown = function(event)
   {
      if($scope.currAlarmState == 'open' || $scope.currAlarmState == 'in Progress' || $scope.hasPanicked)
      {
        return;
      }

      if($scope.lat == 0)
      {
        $scope.gpsEnabled(function(enabled)
        {
          if(enabled)
          {
            $scope.showAlert('Error','Please enable GPS services');
          }else
          {
            $scope.showAlert('Error','Waiting for GPS signal.');
          }
        })
        return;
      }

      $scope.gpsEnabled(function(enabled)
      {
        if(enabled)
        {
          event.preventDefault();
          console.log('mouseDown');
          $scope.isMouseDown = true;
          if(!$scope.sendingPanic)
          {
            $scope.progress = 0;
            $scope.runProgress();
          }
          
        }else
        {
          $scope.showAlert('Error','Please enable GPS services');
          $scope.sendingPanic = false;
        }
     })

      
   }
   $scope.mouseUp = function()
   {
      console.log('mouseUp ' + $scope.currAlarmState);
      if($scope.currAlarmState == 'open' || $scope.currAlarmState == 'in Progress' || $scope.hasPanicked)
      {
        return;
      }

      console.log('mouseUp');
      $scope.isMouseDown = false;
      
      if(!$scope.sendingPanic)
      {
        $scope.btnLabel = "HOLD TO<br>PANIC";
        $scope.progress = 0;
      }
   }
   
   $scope.runProgress = function()
   {
      setTimeout(function(){
        if($scope.isMouseDown)
        {
          $scope.progress = $scope.progress + 1;
          console.log('Increment ' + $scope.progress);
          $scope.btnLabel = "HOLD TO<br>PANIC";
          $scope.$apply();

          if($scope.progress == 100)
          {
            $scope.panic();
            $scope.isMouseDown = false;
            // $scope.progress = 0;
            console.log('Send Panic ');
          }else
          {
            $scope.runProgress();
          }
        }
      }, 8);  
      return; 
   }

  $scope.loop = function(timeout)
  {
    setTimeout(function(){
      $scope.getGps(function(lat,long)
      {
        if(lat == false)
        {
          $scope.loop(1000);
        }else
        {
          $scope.loop(100000);
        }
      });
    }, timeout);   
  }

  $scope.stateLoop = function(timeout)
  {
      setTimeout(function(){
          $scope.getAlarmState(function(data){

            if($scope.currAlarmState != data.state)
            {
              if(data.state == 'closed' || data.state == 'in Progress')
              {
                navigator.vibrate(2000);
              }
            }

            $scope.currAlarmState = data.state;

            if($scope.currAlarmState == 'closed')
            {
                $scope.btnLabel = "ALARM<br>DONE";
                $scope.progress = 0;
            }else if($scope.currAlarmState == 'in Progress')
            {
                $scope.stateLoop(timeout);
                $scope.btnLabel = "ASSISTANCE<br>ON ITS WAY";
            }else  if($scope.currAlarmState == 'open')
            {
                $scope.stateLoop(timeout);
            }
            
          })

    }, timeout);   
  }

  $scope.getAlarmState = function(cb)
  {
        panicService.getState($scope.currAlarmId).then(function(data) {
                cb(data.data);
        });
  }


  document.addEventListener('deviceready', function () {
    $scope.mapWidth = document.getElementById('mapContent').offsetWidth;
    $scope.mapHeight = document.getElementById('mapContent').offsetHeight;
    // $scope.mapHeight = document.getElementById('mapContent').offsetHeight / 2;
    // $scope.mapHeight = Math.floor($scope.mapHeight) - 15;
    $scope.getGps();
    $scope.loop(10000);

    $cordovaFile.readAsText(cordova.file.dataDirectory, 'map.dat')
    .then(function (success) {

      var data = JSON.parse(success);

      $scope.lat = data.lat;
      $scope.long = data.long;
      $scope.map = data.map;
      
    }, function (error) {
    });


  })

  $scope.showAlert = function(title,msg) {
         $scope.alertPopup = $ionicPopup.alert({
           title: title,
           template: msg
         });
       };

})

