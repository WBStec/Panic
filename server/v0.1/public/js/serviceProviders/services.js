serviceModule.factory('SPService', ['$http', function($http) {
    return {
        getSP: function(data) {
            var url = 'http://'+location.host+'/api/sp';
            return $http.get(url);
        },
        updateUser: function(data) {
            
            var url = 'http://'+location.host+'/api/sp/' + data._id;
            return $http.put(url,data);
        }
        ,
        addUser: function(data) {
            
            var url = 'http://'+location.host+'/api/sp/';
            return $http.post(url,data);
        }
    }
}]);
