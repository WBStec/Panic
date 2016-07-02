controllerModule.controller('UserManageCtrl', [
    '$mdSidenav', '$mdBottomSheet', '$log', '$q', 'UserService', '$cookies', '$rootScope', '$scope', '$state', '$mdMedia', '$mdDialog', '$mdToast', '$rootScope',
    function( $mdSidenav, $mdBottomSheet, $log, $q, UserService, $cookies, $rootScope, $scope, $state, $mdMedia, $mdDialog, $mdToast, $rootScope) {
        var self = this;

        $rootScope.view = 'user';

        var pageSize = 10;
        $scope.pageSize = pageSize;
        $scope.loaded = false;
        $scope.users = [];
        self.filterUsers = function(data)
        {
            var returnData = [];
            for(var i in data)
            {
                // if(data[i].id > 5)
                // {
                    returnData.push(data[i]);
                // }
            }
            return returnData;
        }

        self.page = function(start)
        {
            return self.users.slice((start*pageSize),(start*pageSize) + pageSize);
        }

        self.resolveLocation = function(users)
        {
            for(var i in users)
            {
                users[i].location = '';
                for(var j in self.locations)
                {
                    if(users[i].locationId == self.locations[j].id)
                    {
                        parentId = self.locations[j].parentId;
                        users[i].location = self.locations[j].name;
                        while(parentId != -1)
                        {
                            
                            for(var k in self.locations)
                            {
                                if(self.locations[k].id == parentId)
                                {
                                    users[i].location = self.locations[k].name + ' -> ' + users[i].location;
                                    parentId = self.locations[k].parentId;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }

        self.currPage = 0;
        self.initUsers = function()
        {
                UserService.getUsers()
                    .success(function(data, status, headers, config) {
                        console.log('SUCCESSFULL RETURN');
                        //TODO: Add a loader

                        self.allUsers = self.filterUsers(data);
                        // self.resolveLocation(self.allUsers);
                        self.users = self.allUsers;
                        $scope.users = self.page(self.currPage);
                        $scope.loaded = true;
                    })
                    .error(function(data, status, headers, config)
                    {
                        alert('Get User FAIL ' + data);
                    });

        },

        self.initLocations = function(cb)
        {
            return;
                UserService.getLocations()
                    .success(function(data, status, headers, config) {
                        console.log('SUCCESSFULL RETURN');
                        //TODO: Add a loader
                        self.locations = (data);
                        cb();
                    })
                    .error(function(data, status, headers, config)
                    {
                        alert('Get User FAIL ' + data);
                    });

        }

        self.initProfiles = function(cb)
        {
            return;
                UserService.getProfiles()
                    .success(function(data, status, headers, config) {
                        console.log('SUCCESSFULL RETURN');
                        //TODO: Add a loader

                        self.profiles = [];
                        for(var i in data)
                        {
                            if(data[i].id >= 28)
                                self.profiles.push(data[i]);
                        }
                        // self.profiles = (data);
                        cb();
                    })
                    .error(function(data, status, headers, config)
                    {
                        alert('Get User FAIL ' + data);
                    });

        }

        // self.initLocations(function() {
        //   self.initProfiles(function() {
            self.initUsers();
        //   });
        // });

        $scope.searchText = "";
        self.currPage = 0;
        $scope.page = self.currPage;

        $scope.prevPage = function()
        {
            self.currPage = self.currPage - 1;
            $scope.page = self.currPage;
            $scope.users = self.page($scope.page);
        }
        $scope.nextPage = function()
        {
            self.currPage = self.currPage + 1;
            $scope.page = self.currPage;
            $scope.users = self.page($scope.page);
        }


        $scope.filterUsers = function()
        {
            self.currPage = 0;
            $scope.page = self.currPage;
            self.users = [];
            for(var i in self.allUsers)
            {
                if(self.allUsers[i].name.toUpperCase().indexOf($scope.searchText.toUpperCase()) > -1)
                    self.users.push(self.allUsers[i]);
            }

            $scope.users = self.page(0);

        }

        $scope.getSyncData = function(ev,user)
        {
            ev.stopPropagation();
            alert('Show Sync Details Here');
        }


        $scope.disable = function(ev,user)
        {
            ev.stopPropagation();
            var confirm = $mdDialog.confirm()
                      .title('Disable User')
                      .textContent('Are you sure you want to Disable the User:' + user.name)
                      .ariaLabel('Lucky day')
                      .targetEvent(ev)
                      .ok('Yes')
                      .cancel('No');
                $mdDialog.show(confirm).then(function() {

                    $rootScope.showCustomLoader("Please wait while disabling User.");

                    var disableData = {
                        id : user._id,
                        value: {active:false}
                    };

                    UserService.setUserState(disableData)
                        .success(function(data) {
                            $rootScope.hideCustomLoader();

                            if(data == 'succesfully saved')
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

                }, function() {
                });
        }

        $scope.enable = function(ev,user)
        {
            ev.stopPropagation();
            var confirm = $mdDialog.confirm()
                      .title('Enable User')
                      .textContent('Are you sure you want to Enable the User:' + user.name)
                      .ariaLabel('Lucky day')
                      .targetEvent(ev)
                      .ok('Yes')
                      .cancel('No');
                $mdDialog.show(confirm).then(function() {

                    $rootScope.showCustomLoader("Please wait while Enabling User.");

                    var enableData = {
                        id : user._id,
                        value: {active:true}
                    };

                    UserService.setUserState(enableData)
                        .success(function(data) {
                            $rootScope.hideCustomLoader();

                            if(data == 'succesfully saved')
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

                }, function() {
                });

        }

        $scope.delete = function(ev,user)
        {
            ev.stopPropagation();

            var confirm = $mdDialog.confirm()
                      .title('Delete User')
                      .textContent('Are you sure you want to delete the User:' + user.name)
                      .ariaLabel('Lucky day')
                      .targetEvent(ev)
                      .ok('Yes')
                      .cancel('No');
                $mdDialog.show(confirm).then(function() {

                    $rootScope.showCustomLoader("Please wait while deleting User.");

                    UserService.deleteUser(user)
                        .success(function(data) {
                            $rootScope.hideCustomLoader();

                            if(typeof data.statusCode != 'undefined' && data.statusCode == 200)
                            {
                                $mdDialog.hide();
                                $rootScope.showToastBtmRight("User has been deleted.");
                                self.initUsers();
                            }else if(typeof data.message != 'undefined')
                            {
                                $rootScope.showToastBtmRight(data.message);
                            }else
                            {
                                $rootScope.showToastBtmRight('User Delete failed');
                            }

                        });

                }, function() {
                });

        }

        $scope.showAddUser = function(ev, selectedUser) {

            $rootScope.showCustomLoader("Please wait while loading user data.");

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            if (typeof selectedUser != "undefined") {

                self.user = selectedUser;
                //  self.user = {
                //     name:selectedUser.name,
                //     id:selectedUser.id,
                //     login:selectedUser.login,
                //     code:selectedUser.code,
                //     officeUser:selectedUser.officeUser,
                //     mobileUser:selectedUser.mobileUser,
                //     locationId:selectedUser.locationId,
                //     profiles:selectedUser.profiles
                // };

                self.isEditUser = true;
            } else {
                self.user = {
                    active:true
                };

                self.isEditUser = false;
            }

            $mdDialog.show({
                    controller: editUserCtrl,
                    templateUrl: '../partials/userDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function(answer) {
                    self.status = 'You said the information was "' + answer + '".';


                }, function() {
                    self.status = 'You cancelled the dialog.';
                    $rootScope.showToastBtmRight("Cancelled user update.");
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                self.customFullscreen = (wantsFullScreen === true);
            });
        };

        function editUserCtrl($scope, $mdDialog) {

            // console.log("Add user" + self.managers.length);
            if(self.isEditUser)
                $scope.userManTittle = "Edit User";
            else
                $scope.userManTittle = "Add User";

            $scope.isEditUser = self.isEditUser;

            $scope.user = self.user;
            // $scope.managers = self.managers;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.update = function() {

                if($scope.waiting == true)
                {
                    return;
                }
                $scope.waiting = true;

                if ($scope.user.name != '' && $scope.user.surname != '' && $scope.user.phone != '' && $scope.user.address != '')
                {
                    self.user = $scope.user;
                    $rootScope.showCustomLoader("Please wait while updating user.");

                    UserService.updateUser($scope.user)
                        .success(function(data) {

                            $scope.waiting = false;

                            $rootScope.hideCustomLoader();

                            if(data == 'succesfully saved')
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
                
                if($scope.waiting == true)
                {
                    return;
                }
                $scope.waiting = true;

                if ($scope.user.name != '' && $scope.user.surname != '' && $scope.user.phone != '' && $scope.user.address != '')
                {
                    self.user = $scope.user;
                    $rootScope.showCustomLoader("Please wait while updating user.");

                    $scope.user.photo = "";
                    UserService.addUser($scope.user)
                        .success(function(data) {

                            $scope.waiting = false;

                            $rootScope.hideCustomLoader();


                            if(data.message ==  'User created!')
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
            $rootScope.hideCustomLoader();
        }

    }
])
