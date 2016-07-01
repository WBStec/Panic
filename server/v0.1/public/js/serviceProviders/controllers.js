controllerModule.controller('SPManageCtrl', [
    '$mdSidenav', '$mdBottomSheet', '$log', '$q', 'SPService', '$cookies', '$rootScope', '$scope', '$state', '$mdMedia', '$mdDialog', '$mdToast', '$rootScope',
    function( $mdSidenav, $mdBottomSheet, $log, $q, SPService, $cookies, $rootScope, $scope, $state, $mdMedia, $mdDialog, $mdToast, $rootScope) {
        var self = this;

        $rootScope.view = 'serviceProvider';

        var pageSize = 10;
        $scope.pageSize = pageSize;
        $scope.loaded = false;
        $scope.sps = [];
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
            return self.sps.slice((start*pageSize),(start*pageSize) + pageSize);
        }

        self.currPage = 0;
        self.initSP = function()
        {
                SPService.getSP()
                    .success(function(data, status, headers, config) {
                        console.log('SUCCESSFULL RETURN');
                        //TODO: Add a loader
                        debugger;
                        self.allSPs = self.filterUsers(data);
                        // self.resolveLocation(self.allSPs);
                        self.sps = self.allSPs;
                        $scope.sps = self.page(self.currPage);
                        $scope.loaded = true;
                    })
                    .error(function(data, status, headers, config)
                    {
                        alert('Get User FAIL ' + data);
                    });

        },

        

        // self.initLocations(function() {
        //   self.initProfiles(function() {
            self.initSP();
        //   });
        // });

        $scope.searchText = "";
        self.currPage = 0;
        $scope.page = self.currPage;

        $scope.prevPage = function()
        {
            self.currPage = self.currPage - 1;
            $scope.page = self.currPage;
            $scope.sps = self.page($scope.page);
        }
        $scope.nextPage = function()
        {
            self.currPage = self.currPage + 1;
            $scope.page = self.currPage;
            $scope.sps = self.page($scope.page);
        }


        $scope.filterUsers = function()
        {
            self.currPage = 0;
            $scope.page = self.currPage;
            self.sps = [];
            for(var i in self.allSPs)
            {
                if(self.allSPs[i].name.toUpperCase().indexOf($scope.searchText.toUpperCase()) > -1)
                    self.sps.push(self.allSPs[i]);
            }

            $scope.sps = self.page(0);

        }

        $scope.showAddSP = function(ev, selectedSP) {


            $rootScope.showCustomLoader("Please wait while loading service provider data.");

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            if (typeof selectedSP != "undefined") {

                self.sp = selectedSP;

                self.isEditUser = true;
            } else {
                self.sp = {
                    active:true
                };

                self.isEditUser = false;
            }

            $mdDialog.show({
                    controller: editSPCtrl,
                    templateUrl: '../partials/serviceProvidersDialog.html',
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

        function editSPCtrl($scope, $mdDialog) {

            // console.log("Add user" + self.managers.length);
            if(self.isEditUser)
                $scope.userManTittle = "Edit User";
            else
                $scope.userManTittle = "Add User";

            $scope.isEditUser = self.isEditUser;

            $scope.sp = self.sp;
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

                if ($scope.sp.login != '' && $scope.sp.password != '' && $scope.sp.phone != '' && $scope.sp.name != '')
                {
                    self.sp = $scope.sp;
                    $rootScope.showCustomLoader("Please wait while updating service provider.");

                    SPService.updateUser($scope.sp)
                        .success(function(data) {

                            $scope.waiting = false;

                            $rootScope.hideCustomLoader();

                            if(data == 'succesfully saved')
                            {
                                $mdDialog.hide();
                                $rootScope.showToastBtmRight("Service provider has been updated.");
                                self.initSP();
                            }else if(typeof data.message != 'undefined')
                            {
                                $rootScope.showToastBtmRight(data.message);
                            }else
                            {
                                $rootScope.showToastBtmRight('Service provider Update failed');
                            }

                        });
                } else {
                    console.log("Not all fields entered correctly.");
                    alert("Not all fields entered correctly.");
                }
            };

            $scope.add = function() {
                
                debugger;
                if($scope.waiting == true)
                {
                    return;
                }
                $scope.waiting = true;

                if ($scope.sp.login != '' && $scope.sp.password != '' && $scope.sp.phone != '' && $scope.sp.name != '')
                {
                    self.sp = $scope.sp;
                    $rootScope.showCustomLoader("Please wait while updating Service provider.");

                    SPService.addUser($scope.sp)
                        .success(function(data) {

                            $scope.waiting = false;

                            $rootScope.hideCustomLoader();


                            if(data.message ==  'created!')
                            {
                                $mdDialog.hide();
                                $rootScope.showToastBtmRight("Service provider has been updated.");
                                self.initSP();
                            }else if(typeof data.message != 'undefined')
                            {
                                $rootScope.showToastBtmRight(data.message);
                            }else
                            {
                                $rootScope.showToastBtmRight('Service provider Update failed');
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
