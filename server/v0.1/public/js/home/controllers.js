mainModule.controller('HomeCtrl', [
    '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$cookies', '$rootScope', 'AlarmService', '$scope', '$state','$window',
    function($mdSidenav, $mdBottomSheet, $log, $q, $cookies, $rootScope, AlarmService, $scope, $state,$window) {
        var self = this;

        self.initUsers = function()
        {
                AlarmService.getUsers()
                    .success(function(data, status, headers, config) {
                        console.log('SUCCESSFULL RETURN');
                        //TODO: Add a loader
                        // self.users = self.filterUsers(data)
                        self.resolveLocation(self.users);
                        $scope.users = self.users;
                    })
                    .error(function(data, status, headers, config)
                    {
                        alert('Get User FAIL ' + data);
                    });

        },

        self.initAlarms = function(cb)
        {
          AlarmService.getAlarms()
              .success(function(data, status, headers, config) {
                  console.log('SUCCESSFULL RETURN');
                  //TODO: Add a loader
                  self.alarms = (data);
                  $scope.alarms = data;
                  cb();
              })
              .error(function(data, status, headers, config)
              {
                  alert('Get User FAIL ' + data);
              });

        }


        self.initAlarms(function()
        {
            self.initUsers();        
        });

        self.loop = function()
        {
          setTimeout(function(){
            self.initAlarms(function()
            {
              self.loop();
            });
          }, 1000);   
        }
        self.loop();

        $scope.update = function($event,alarm)
        {
          alarm.state = "closed";
          AlarmService.setAlarm(alarm)
            .success(function(data) {

              // $rootScope.hideCustomLoader();

              if(data == 'succesfully saved')
              {
                  $mdDialog.hide();
                  $rootScope.showToastBtmRight("Alarm has been updated.");
                  self.initAlarms();
              }else if(typeof data.message != 'undefined')
              {
                $rootScope.showToastBtmRight(data.message);
              }else
              {
                $rootScope.showToastBtmRight('Alarm Update failed');
              }
              
            });
        }


    }
]);
