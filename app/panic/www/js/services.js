angular.module('starter.services', [])

.service('LoginService', function($http) {
    return {
        getUser : function(userName,password) {
          return $http.get('http://10.0.0.101:8080/api/users/' + userName + '/' + password);
        }
    }
})
.service('panicService',function($http)
{
  return {
    host:'http://10.0.0.102:8080'
    // host:'http://196.31.215.98:80'
    // host:'http://10.0.0.104:8080'
    ,
    getAreas : function(userName,password) {
          return $http.get(this.host + '/api/areas');
      },

    register : function(formData)
    {
      console.log('register');
      console.log(this.host + '/api/users');
      return $http.post(this.host + '/api/users', formData);
    }
    ,
    panic : function(formData)
    {
      return $http.post(this.host + '/api/alarms', formData);
    }
    ,
    getMap : function(lat,long,mapWidth,mapHeight)
    { 
      var newLat = lat - 0.005;
      console.log('http://maps.googleapis.com/maps/api/staticmap?center='+(newLat)+','+long+'&zoom=15&size='+mapWidth+'x'+mapHeight+'&sensor=false&markers=color:red%7C'+lat+','+long);
      return $http.get('http://maps.googleapis.com/maps/api/staticmap?center='+(newLat)+','+long+'&zoom=15&size='+mapWidth+'x'+mapHeight+'&sensor=false&markers=color:red%7C'+lat+','+long,{responseType: 'arraybuffer'});
      //return $http.get('http://10.0.0.101:8080/api/users/' + userName + '/' + password);
    }
    ,
    getState : function(alarmId)
    { 
      return $http.get(this.host + '/api/alarmUser/' + alarmId);
    }
  }
})
.service('myservice', function () {
        this.username = '';
        this.password = '';
        this.userRole = '';
        this.currPoll = '';
        this.loggedIn = false;
    });