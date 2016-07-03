serviceModule.factory('LoginService', ['$http', function($http) {

    return {
        login: function(data) {

            var url = 'http://'+location.host+'/api/login/' + data.credentials.username + '/' + data.credentials.password;
            return $http.get(url);

        	// var obj = {};

        	// obj.success = function(cb)
        	// {
        	// 	console.log(data.credentials.username);
        	// 	console.log(data.credentials.password);
        	// 	if(data.credentials.username == 'admin')
        	// 	{
        	// 		data.login = 'good';
        	// 	}else
        	// 	{
        	// 		data = "Wrong username and password combination."	
        	// 	}
        	// 	cb(data);
        	// }
        	// return obj;
			// var url = 'http://'+location.host+'/api/login/'+data.credentials.username+'/'+data.credentials.password;
			// return $http.get(url);
        }
    }
}]);
