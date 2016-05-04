serviceModule.factory('AlarmService', ['$http', function($http) {

    return {
        getAlarms: function(data) {
			var url = 'http://'+location.host+'/api/alarms';
			return $http.get(url);
        }

        ,
        getUsers: function(data) {
			var url = 'http://'+location.host+'/api/users';
			return $http.get(url);
        }
		,
        setAlarm: function(data) {
        	
			var url = 'http://'+location.host+'/api/alarms/' + data._id;
			return $http.put(url,data);
        }
    }
}]);
