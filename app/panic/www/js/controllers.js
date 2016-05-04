angular.module('starter.controllers', [])

.controller('RegisterCtrl', function($scope, $ionicPopup, $state,panicService) {
    $scope.data = {};
 
    $scope.data.user = '';// = myservice.username;
    $scope.data.password = '';//= myservice.password;


    // var uuid = device.uuid;

    // navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);

    $scope.register = function() {

        try{
            panicService.register($scope.data).success(function(data) {

              $state.go('main');      
             
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

   $scope.panic = function()
   {

      CheckGPS.check(function win(){
      //GPS is enabled! 
        
          var posOptions = {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0
          };

               $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat  = position.coords.latitude;
                var long = position.coords.longitude;

                 $scope.alarm.gpsLat = lat;
                 $scope.alarm.gpsLon = long;
                 panicService.panic($scope.alarm).success(function(data) {

                    alert(JSON.stringify(data.message));
               
                });
            }, function(err) {
                alert(JSON.stringify(err));
                console.log(err);
            });
      },
      function fail(){
        //GPS is disabled! 
        alert('Enable GPS location service')
      });
   }
})

