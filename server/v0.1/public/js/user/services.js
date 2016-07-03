serviceModule.factory('UserService', ['$http', function($http) {
    return {
        getUsers: function(data) {
            var url = 'http://'+location.host+'/api/users';
            return $http.get(url);
        },
        getAreas: function(data) {
            var url = 'http://'+location.host+'/api/areas';
            return $http.get(url);
        },
        setUserState: function(data) {
            
            var url = 'http://'+location.host+'/api/users/state/' + data.id;
            return $http.put(url,data.value);
        }
        ,
        updateUser: function(data) {
            
            var url = 'http://'+location.host+'/api/users/' + data._id;
            return $http.put(url,data);
        }
        ,
        addUser: function(data) {
            
            var url = 'http://'+location.host+'/api/users/';
            return $http.post(url,data);
        }
    }
}]);
