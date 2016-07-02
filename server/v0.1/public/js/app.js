var controllerModule = angular.module('claims.ctrl',[]);
var serviceModule = angular.module('claims.service',[]);
var mainModule = angular.module('claims.app', [
    'ngStorage',
    'ngAria',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'ngCookies',
    'ngPassword',
    'ui.router',
    'claims.ctrl',
    'claims.service'
])

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
// .config(function($mdDateLocaleProvider) {
//     $mdDateLocaleProvider.formatDate = function(date) {
//        // return moment(date).format('YYYY-MM-DD');
//     };
// });;

mainModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider.
            state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            }).
            state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            }).
            state('serviceProviders', {
                url: '/serviceProviders',
                templateUrl: 'partials/serviceProviders.html',
                controller: 'SPManageCtrl'
            }).
            state('userSubtitution', {
                url: '/userSubtitution',
                templateUrl: 'partials/userSubtitution.html',
                controller: 'UserSubtitutionCtrl'
            }).
            state('users', {
                url: '/users',
                templateUrl: 'partials/users.html',
                controller: 'UserManageCtrl'
            }).
            state('claims', {
                url: '/claims',
                templateUrl: 'partials/claims.html',
                controller: 'ClaimsCtrl'
            }).
            state('claimType', {
                url: '/claimType',
                templateUrl: 'partials/claimTypes.html',
                controller: 'ClaimTypesCtrl',
                controllerAs: 'clt'
            }).
            state('approvals', {
                url: '/approvals',
                templateUrl: 'partials/approvals.html',
            }).
            state('approvals.list', {
                url: '/list',
                templateUrl: 'partials/approval/approvalList.html',
                controller: 'ApprovalsCtrl'
            }).
            state('approvals.detail', {
                url: '/approvals',
                templateUrl: 'partials/approval/approvalDetial.html',
                controller: 'ApprovalDetailCtrl'
            }).
            state('settings', {
                url: '/settings',
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl'
            }).
            state('vehicle', {
                url: '/vehicle',
                templateUrl: 'partials/vehicle.html',
                controller: 'VehicleCtrl',
                controllerAs: 'clt'
            });




    }]);
mainModule.config(function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPalettePrimary', {
        '50': 'E0E0E0',
        '100': 'E0E0E0',
        '200': 'E0E0E0',
        '300': 'E0E0E0',
        '400': 'E0E0E0',
        '500': 'E0E0E0',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text     (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('amazingPaletteAccent', {
        '50': '6cc24a',
        '100': '6cc24a',
        '200': '6cc24a',
        '300': '6cc24a',
        '400': '6cc24a',
        '500': '6cc24a',
        '600': '6cc24a',
        '700': '6cc24a',
        '800': '6cc24a',
        '900': '6cc24a',
        'A100': '6cc24a',
        'A200': '6cc24a',
        'A400': '6cc24a',
        'A700': '6cc24a',
        'contrastDefaultColor': 'light',    // whether, by default, text     (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('amazingPalettePrimary')
        .accentPalette('amazingPaletteAccent');
});
mainModule.run(['$rootScope', '$localStorage', '$mdToast', '$state', function ($rootScope, $localStorage, $mdToast, $state) {
    console.log("Halo");
    console.log("logged in: " + $rootScope.isLoggedIn);


    $rootScope.saveToken = function (token) {
        $localStorage.token = token;
    }
    $rootScope.saveUserDetails = function (data) {
        $localStorage.user = data;
    }
    $rootScope.logout = function () {
        $rootScope.view = 'login';        
        $localStorage.token = "";
        $rootScope.isLoggedIn = false;
        $state.go('login');
    }
    $rootScope.getToken = function () {
        return $localStorage.token;
    }
    $rootScope.getUserDetails = function () {
        return $localStorage.user;
    }

    $rootScope.showToastBtmRight = function (msg) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(msg)
                .position('bottom right')
                .hideDelay(3000)
        );
    };
    $rootScope.showToastBtmLeft = function (msg) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(msg)
                .position('bottom left')
                .hideDelay(3000)
        );
    };

    $rootScope.showCustomLoader=function(msg){
        $rootScope.loaderMessage=msg;
        $rootScope.showLoader=true;
        $rootScope.loaderClass="loader";
        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = "no"; // ie only
    }
    $rootScope.hideCustomLoader=function(){
        $rootScope.showLoader=false;
        $rootScope.loaderClass="";
        document.documentElement.style.overflow = 'auto';  // firefox, chrome
        document.body.scroll = "yes"; // ie only
    }
    $rootScope.popover = {
        "title": "Title",
        "content": "Hello Popover<br />This is a multiline message!"
    };

    var tok = $rootScope.getToken();
    if (typeof tok != "undefined" && tok != undefined && tok != "") {
        $rootScope.isLoggedIn = true;

        $rootScope.user = $rootScope.getUserDetails();
        //$state.go('users');
        $rootScope.userRole=$rootScope.user;//$rootScope.user.membership[0].communityRoles[0].role;

        console.log("tokk " + JSON.stringify($rootScope.user));
        //alert("toke = "+tok);
    }
    $rootScope.emailValidate = function (email) {
        var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        if (!emailFilter.test(email)) {
            //alert('Please enter a valid e-mail address.');
            return false;
        } else {
            return true;
        }
    }


    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams, options) {

            console.log("Halo 222");
            console.log("state change: " + toState.name + " login ==" + $rootScope.isLoggedIn);
            if (!$rootScope.isLoggedIn && toState.name != 'login') {
                event.preventDefault();
                $state.go('login');
            } else if ($rootScope.isLoggedIn && toState.name == 'login') {
                console.log("you are logged on")
                event.preventDefault();
                if($rootScope.userRole=="admin") {
                    $rootScope.isManager=true;
                    $state.go('home');
                }else{
                    $rootScope.isManager=false;
                    $state.go('home');
                }
            }
            //else if(!$rootScope.isLoggedIn){
            //  event.preventDefault();
            //  $state.go('login');
            //}
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
        })
}]);

var compareTo = function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};

mainModule.directive("compareTo", compareTo);