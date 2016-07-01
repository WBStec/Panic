serviceModule.factory('NavService', ['$q','$rootScope', function($q,$rootScope) {

  var level = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];

    var navItems = [{
        name: 'Home',
        avatar: 'assets/icon/ic_home_24px.svg',
        state: 'home',
        homeScreen : false,
        permission : [],
        level: level
    },{
        name: 'Users',
        avatar: 'assets/icon/ic_person_24px.svg',
        state: 'users',
        homeScreen : true,
        permission : [],
        level: [35]
    },{
        name: 'Service Providers',
        avatar: 'assets/icon/ic_person_24px.svg',
        state: 'serviceProviders',
        homeScreen : true,
        permission : [],
        level: [35]
    }];
    return {
        loadAllItems: function() {
            return $q.when(navItems);
        },
        loadUserItems: function(){

            if(typeof $rootScope == 'undefined' )
            {
                $rootScope = {};
            }
            if(typeof $rootScope.user == 'undefined' )
            {
                $rootScope.user = {};
            }
            if(typeof $rootScope.user.profiles == 'undefined')
            {
                $rootScope.user.profiles = [];
            }
            if(typeof $rootScope.user.permissionsCollection == 'undefined')
            {
                $rootScope.user.permissionsCollection = {};
            }
             if(typeof $rootScope.user.permissionsCollection.all == 'undefined')
            {
                $rootScope.user.permissionsCollection.all = [];
            }

            var userPermissions = $rootScope.user.permissionsCollection.all;
            var userLevels = $rootScope.user.profiles;

            var result = navItems.filter(function(elem){

                return true;

                for(var i in userPermissions)
                {
                    if(elem.permission.indexOf(userPermissions[i].section)!=-1)
                        return true;
                }
                for(var i in userLevels)
                {
                    if(elem.level.indexOf(userLevels[i])!=-1)
                        return true;
                }
                return false;//Do not filter
            });

            return  $q.when(result);
        }
    };
}])
