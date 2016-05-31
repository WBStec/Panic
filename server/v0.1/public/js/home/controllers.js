mainModule.controller('HomeCtrl', [
    '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$cookies', '$rootScope', 'AlarmService', '$scope', '$state','$window','$mdDialog','$mdMedia',
    function($mdSidenav, $mdBottomSheet, $log, $q, $cookies, $rootScope, AlarmService, $scope, $state,$window,$mdDialog, $mdMedia) {
        var self = this;

        self.initUsers = function()
        {
                AlarmService.getUsers()
                    .success(function(data, status, headers, config) {
                        console.log('SUCCESSFULL RETURN');
                        //TODO: Add a loader
                        // self.users = self.filterUsers(data)
                        // self.resolveLocation(self.users);
                        self.users = data;
                        $scope.users = self.users.reverse();

                    })
                    .error(function(data, status, headers, config)
                    {
                        alert('Get User FAIL ' + data);
                    });

        },

        self.lastId = '';
        self.firstCheck = true;
        self.soundAlarm = false;
        self.initAlarms = function(cb)
        {
          AlarmService.getAlarms()
              .success(function(data, status, headers, config) {
                  console.log('SUCCESSFULL RETURN');
                  //TODO: Add a loader
                  if(self.firstCheck)
                  {
                    if(data.length > 0)
                    {
                        self.lastId = data[0]._id
                    }
                    self.firstCheck = false;
                  }else
                  {
                    if(data.length > 0)
                    {
                      if(self.lastId != data[0]._id)
                      {
                        if(!self.soundAlarm)
                        {


                          self.soundAlarm = true;
                          var audio = new Audio('assets/siren.mp3');
                          audio.addEventListener('ended', function() {
                            if(self.soundAlarm)
                            {
                              this.currentTime = 0;
                              this.play();  
                            }
                            
                          }, false);
                          audio.play();

                           var confirm = $mdDialog.confirm()
                                  .title('A new alarm has been created')
                                  .textContent('Click okay to stop siren.')
                                  .ok('OK')
                            $mdDialog.show(confirm).then(function() {
                              self.soundAlarm = false;
                            }, function() {

                            });
                        }

                        $rootScope.showToastBtmRight("New Alarm.");
                        self.lastId = data[0]._id;
                      }
                    }
                  }

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
          $event.stopPropagation();
          if(alarm.state == 'open')
          {
            alarm.state = "in Progress";
          }else if(alarm.state == 'in Progress')
          {
            alarm.state = "closed";
          }
          
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

        $scope.showAlarm = function($event,alarm)
        {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
          self.alarm = alarm;

          for(var i in self.users)
          {
            if(self.users[i].uuid == alarm.uuid)
            {
              alarm.name = self.users[i].name;
              alarm.surname = self.users[i].surname;
              alarm.phone = self.users[i].phone;
              alarm.address = self.users[i].address;
              alarm.direction = self.users[i].direction;
              alarm.photo = self.users[i].photo;
              break;
            }
          }

          $mdDialog.show({
                    controller: viewAlarmCtrl,
                    templateUrl: '../partials/alarmDailog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function(answer) {
                    // self.status = 'You said the information was "' + answer + '".';

                }, function() {
                    // self.status = 'You cancelled the dialog.';
                    // $rootScope.showToastBtmRight("Cancelled user update.");
                });
        }

        function viewAlarmCtrl($scope, $mdDialog) {

            // $scope.managers = self.managers;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.delete = function(ev) {
 
            };

            $scope.alarm = self.alarm;

            $scope.update = function() {

                if ($scope.user.login != '' && $scope.user.name != '' && $scope.user.code != '')
                {
                    $rootScope.showCustomLoader("Please wait while updating user.");

                    UserService.updateUser($scope.user)
                        .success(function(data) {
                            $rootScope.hideCustomLoader();

                            if(typeof data.statusCode != 'undefined' && data.statusCode == 200)
                            {
                                $mdDialog.hide();
                                $rootScope.showToastBtmRight("User has been updated.");
                                self.initUsers();
                            }else if(typeof data.message != 'undefined')
                            {
                                $rootScope.showToastBtmRight(data.message);
                            }else
                            {
                                $rootScope.showToastBtmRight('User Update failed');
                            }
                            
                        });
                } else {
                    console.log("Not all fields entered correctly.");
                    alert("Not all fields entered correctly.");
                }
            };

            $scope.add = function() {
                var emptyObj = {};

                if ($scope.user.login != '' && $scope.user.name != '' && $scope.user.code != '')
                {
                    // $scope.user.contactInformation.email2 = $scope.user.contactInformation.email;
                    // $scope.user.token = token;
                    // $scope.user.communityId = $rootScope.user.membership[0]._communityId;
                    // //$mdDialog.hide($scope.user);

                    //$rootScope.showCustomLoader("Please wait while adding user.");

                    UserService.addUser($scope.user)
                        .success(function(data) {
                            $rootScope.hideCustomLoader();

                            if(typeof data.statusCode != 'undefined' && data.statusCode == 200)
                            {
                                $mdDialog.hide();
                                $rootScope.showToastBtmRight("User has been added.");
                                self.initUsers();
                            }else if(typeof data.message != 'undefined')
                            {
                                $rootScope.showToastBtmRight(data.message);
                            }else
                            {
                                $rootScope.showToastBtmRight('User Adding failed');
                            }
                        });
                } else {
                    console.log("Not all fields entered correctly.");
                    alert("Not all fields entered correctly.");
                }

            };
        }


    }
]);
