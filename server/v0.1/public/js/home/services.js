serviceModule.factory('AlarmService', ['$http', function($http) {

    return {
        getAlarms: function(data) {

            if(data.role == 'SP')
            {
                var url = 'http://'+location.host+'/api/alarms/' + data.id;
            }else
            {
                var url = 'http://'+location.host+'/api/alarms';    
            }
			
			return $http.get(url);
        }

        ,
        getUsers: function(data) {
            var url = 'http://'+location.host+'/api/users';
            return $http.get(url);
        }
        ,
        getUser: function(data) {
            var url = 'http://'+location.host+'/api/users/' + data.uuid;
            return $http.get(url);
        }
        ,
        setAlarm: function(data) {
        	
			var url = 'http://'+location.host+'/api/alarms/' + data._id;
			return $http.put(url,data);
        }
    }
}]);
