angular.module('starter.controllers', [])

.controller('LoaderCtrl', function($scope, $ionicPopup, $state,panicService,$cordovaFile) {
 
    document.addEventListener('deviceready', function () {

      var fileName = "panic_cache.txt";

      $cordovaFile.checkFile(cordova.file.dataDirectory, fileName)
        .then(function (success) {
           $cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
            .then(function (success) {
              $state.go('main');  
            }, function (error) {
              $state.go('register');  
            });

        }, function (error) {
          $state.go('register');  
        });
    });

})
.controller('RegisterCtrl', function($scope, $ionicPopup, $state,panicService,$cordovaFile) {
 
    var fileName = "panic_cache.txt";
    
    $scope.data = {};
 
    $scope.data.user = '';// = myservice.username;
    $scope.data.password = '';//= myservice.password;
    $scope.register = function() {

        var uuid = device.uuid;

        try{
            panicService.register($scope.data).success(function(data) {

              $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, uuid, true)
                .then(function (success) {
                  $state.go('main'); 
                }, function (error) {
                  alert('Could not write file.');
                });
            });
      }catch(err)
      {
        alert(err);
      }
    }

})
.controller('MainCtrl', function($scope, $ionicPopup, $state,panicService,$cordovaGeolocation) {
   
  var uuid = device.uuid;

  $scope.alarm = {};
  $scope.alarm.alarmDate = new Date();  
  $scope.alarm.closeDate = '';  
  $scope.alarm.uuid = uuid;  
  $scope.alarm.gpsLat = '0';  
  $scope.alarm.gpsLon = '0';  
  $scope.alarm.state = 'open';  

   $scope.lat = 0;
   $scope.long = 0;
   $scope.panic = function()
   {

      $scope.gpsEnabled(function(enabled)
      {
          if(enabled)
          {
            $scope.getGps(function(lat,long){
                if(lat != false)
                {
                  $scope.alarm.gpsLat = lat;
                  $scope.alarm.gpsLon = long;
                  alert('Send Panic');
                  panicService.panic($scope.alarm).success(function(data) {
                      alert(JSON.stringify(data.message));
                  });
                }
            })
          }else
          {
            alert('ENABLE GPS');
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
            if(typeof cb != 'undefined')
              cb(lat,long);

        }, function(err) {
            alert(JSON.stringify(err));
            console.log(err);
            if(typeof cb != 'undefined')
              cb(false)
        });
   }


   // $scope.setProgress = function(progress)
   // {
   //  console.log('setProgress ' + progress);
   //  return {background-image: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.5) 51%)};
   // };

   $scope.setProgress = function(progress)
   {
      console.log('setProgress ' + progress);
      var grad = 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ' + progress + '%, rgba(255,0,0,0.5) '+(progress+1)+'%)';
      return { "background-image": grad}
   }

   $scope.isMouseDown = false;
   $scope.progress = 0;
   $scope.mouseDown = function(event)
   {
      event.preventDefault();
      console.log('mouseDown');
      $scope.isMouseDown = true;
      $scope.runProgress();
   }
   $scope.mouseUp = function()
   {
      console.log('mouseUp');
      $scope.isMouseDown = false;
      $scope.progress = 0;
   }
   
   $scope.runProgress = function()
   {
      setTimeout(function(){
        if($scope.isMouseDown)
        {
          $scope.progress = $scope.progress + 1;
          console.log('Increment ' + $scope.progress);
          $scope.$apply();

          if($scope.progress == 100)
          {
            $scope.panic();
            $scope.isMouseDown = false;
            $scope.progress = 0;
            console.log('Send Panic ');
          }else
          {
            $scope.runProgress();
          }
        }
      }, 30);  
      return; 
   }

  $scope.loop = function()
  {
    setTimeout(function(){
      $scope.getGps(function(lat,long)
      {
        $scope.loop();
      });
    }, 10000);   
  }

  document.addEventListener('deviceready', function () {
    $scope.mapWidth = document.getElementById('mapContent').offsetWidth;
    $scope.mapHeight = document.getElementById('mapContent').offsetHeight / 2;
    $scope.mapHeight = Math.floor($scope.mapHeight) - 15;
    $scope.getGps();
    $scope.loop();
  })

})

