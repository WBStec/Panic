mainModule.controller('LoginCtrl', [
    '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$cookies', '$rootScope', 'LoginService', '$scope', '$state',
    function($mdSidenav, $mdBottomSheet, $log, $q, $cookies, $rootScope, LoginService, $scope, $state) {

        $scope.login = {};
        
        $scope.submitLogin = function() {
            LoginService.login($scope.login)
                .success(function(data, status, headers, config) {
                    console.log('SUCCESSFULL RETURN');
                    if(typeof data.login == 'undefined')
                    {
                        //Todo: Show nice popup Msg.
                        alert('Error ' + data);
                    }else
                    {
                        $rootScope.isLoggedIn = true;
                        $state.go('home');
                    }

                    // $rootScope.isLoggedIn = true;
                    // console.log("updated type");
                    // var user = { "username": data.credentials.username, "membership": data.membership };
                    // $rootScope.saveUserDetails(user);
                    // $rootScope.saveToken(data.token);

                    // $rootScope.user = $rootScope.getUserDetails();
                    // console.log("role "+JSON.stringify(data.membership[0].communityRoles[0].role));
                    // $rootScope.userRole=data.membership[0].communityRoles[0].role;
                    // $rootScope.$emit('CLAIMS_SUCCESSFUL_LOGIN');
                    // if($rootScope.userRole=="admin") {
                    //     $rootScope.isManager=true;
                    //     $state.go('users');
                    // }else{
                    //     $rootScope.isManager=false;
                    //     $state.go('claims');
                    // }
                })
                .error(function(data, status, headers, config)
                {
                    alert('FAIL ' + data);
                    console.log('FAIL ' + data);
                    console.log('FAIL ' + status);
                    console.log('FAIL ' + headers);
                    console.log('FAIL ' + JSON.stringify(config));
                });
        };
    }
]);
