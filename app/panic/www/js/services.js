angular.module('starter.services', [])



.factory('panicService', function($http) {
  return {
      //host:'http://10.0.0.100:8080'
      host:'http://10.0.0.101:8080'
      ,
      getPoll : function() {
        return $http.get(this.host + '/api/polls');
      },
      createPoll : function(formData) {
        return $http.post(this.host + '/api/polls', formData);
      },
      deletePoll : function(id) {
        return $http.delete(this.host + '/api/polls/' + id);
      },

      //QUESTIONS
      getQuestion : function(pollId) {
        return $http.get(this.host + '/api/questions/' + pollId);
      },
      createQuestion: function(formData) {
        return $http.post(this.host + '/api/questions', formData);
      },
      deleteQuestion : function(id) {
        return $http.delete(this.host + '/api/questions/' + id);
      },

      //RESULTS
      getResults : function(pollId,station) {
        return $http.get(this.host + '/api/results/' + pollId + '/' + station);
      },
      getResultUser : function(pollId,userId) {
        return $http.get(this.host + '/api/resultsUser/' + pollId + '/' + userId);
      },
      getResultQuestion : function(questionId) {
        return $http.get(this.host + '/api/resultsQuestion/' + questionId);
      },
      createResult: function(formData) {
        $http.defaults.headers.post["Content-Type"] = "application/json";
        return $http.post(this.host + '/api/results', formData);
      },
      deleteResult : function(id) {
        return $http.delete(this.host + '/api/results/' + id);
      },


      //USERS
      getManagerUsers : function(manager) {
        return $http.get(this.host + '/api/managerUser/' +  manager);
      },
      getUsers : function() {
        return $http.get(this.host + '/api/users' );
      },
      getUser : function(userName,password) {
        return $http.get(this.host + '/api/users/' + userName + '/' + password);
      },
      createUser: function(formData) {
        return $http.post(this.host + '/api/users', formData);
      },
      deleteUser : function(id) {
        return $http.delete(this.host + '/api/users/' + id);
      },
      updateUser: function(formData) {
        return $http.put(this.host + '/api/user', formData);
      },

      //STATIONS
      getStations : function() {
        return $http.get(this.host + '/api/station' );
      },
      createStation: function(formData) {
        return $http.post(this.host + '/api/station', formData);
      },
      deleteStation : function(id) {
        return $http.delete(this.host + '/api/station/' + id);
      },

  }
})

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
    host:'http://10.0.0.101:8080'
    ,
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
  }
})
.service('myservice', function () {
        this.username = '';
        this.password = '';
        this.userRole = '';
        this.currPoll = '';
        this.loggedIn = false;
    });