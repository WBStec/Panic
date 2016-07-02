serviceModule.factory('NavService', ['$q','$rootScope', function($q,$rootScope) {

  var level = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];

    var navItems = [{
        name: 'Home',
        avatar: 'assets/icon/ic_home_24px.svg',
        state: 'home',
        homeScreen : false,
        permission : ['SP','Admin'],
        level: level
    },{
        name: 'Users',
        avatar: 'assets/icon/ic_person_24px.svg',
        state: 'users',
        homeScreen : true,
        permission : ['Admin'],
        level: []
    },{
        name: 'Service Providers',
        avatar: 'assets/icon/ic_directions_car_24px.svg',
        state: 'serviceProviders',
        homeScreen : true,
        permission : ['Admin'],
        level: []
    }];
    return {
        loadAllItems: function() {
            return $q.when(navItems);
        },
        loadUserItems: function(){

            var userPermissions = $rootScope.user.role;
            
            var result = navItems.filter(function(elem){

                if(elem.permission.indexOf(userPermissions)!=-1)
                    return true;
                
                return false;//Do not filter
            });

            return  $q.when(result);
        }
    };
}])
