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
    // host:'http://10.0.0.102:8080'
    host:'http://196.31.215.98:80'
    // host:'http://10.0.0.104:8080'
    ,
    getAreas : function(userName,password) {
          // return $http.get(this.host + '/api/areas');
          return [{"area":"South Africa","code":0,"parent":-1},{"area":"Gauteng","code":1,"parent":0},{"area":"Pretoria","code":2,"parent":1},{"area":"Pretoria East","code":3,"parent":2},{"area":"Pretoria Central","code":4,"parent":2},{"area":"Pretoria North","code":5,"parent":2},{"area":"Pretoria West","code":6,"parent":2},{"area":"Bronkhorstspruit","code":7,"parent":3},{"area":"Bronkhorstdam","code":8,"parent":3},{"area":"Babsfontein","code":9,"parent":3},{"area":"Waterkloof Glen","code":10,"parent":3},{"area":"Newlands","code":11,"parent":3},{"area":"Constania park","code":12,"parent":3},{"area":"Die Wilgers","code":13,"parent":3},{"area":"La Montagne","code":14,"parent":3},{"area":"Willow Park Manor","code":15,"parent":3},{"area":"Eersterus","code":16,"parent":3},{"area":"Mamelodi","code":17,"parent":3},{"area":"Erasmuskloof","code":18,"parent":3},{"area":"Elardus Park","code":19,"parent":3},{"area":"Rietvalleirand","code":20,"parent":3},{"area":"Faerie Glen","code":21,"parent":3},{"area":"Olympus","code":22,"parent":3},{"area":"Equestria","code":23,"parent":3},{"area":"Garsfontein","code":24,"parent":3},{"area":"Lydiana","code":25,"parent":3},{"area":"Lynwood","code":26,"parent":3},{"area":"Pretorius Park","code":27,"parent":3},{"area":"Murrayfield","code":28,"parent":3},{"area":"Brummeria","code":29,"parent":3},{"area":"Mooikloof","code":30,"parent":3},{"area":"Meyerspark","code":31,"parent":3},{"area":"Grootfontein","code":32,"parent":3},{"area":"Val de Grace","code":33,"parent":3},{"area":"Bashewa","code":34,"parent":3},{"area":"Moreleta Park","code":35,"parent":3},{"area":"Wingate Park","code":36,"parent":3},{"area":"Watloo","code":37,"parent":3},{"area":"Nellmapius","code":38,"parent":3},{"area":"Rayton","code":39,"parent":3},{"area":"Cullinan","code":40,"parent":3},{"area":"Rietvlei View","code":41,"parent":3},{"area":"Silver Lakes","code":42,"parent":3},{"area":"Six Fountains","code":43,"parent":3},{"area":"Hazeldeen","code":44,"parent":3},{"area":"Silverton","code":45,"parent":3},{"area":"Willow Acres","code":46,"parent":3},{"area":"Weavind Park","code":47,"parent":3},{"area":"East Lynne","code":48,"parent":3},{"area":"Wapadrand","code":49,"parent":3},{"area":"Shere","code":50,"parent":3},{"area":"Zwavelpoort","code":51,"parent":3},{"area":"Woodhill","code":52,"parent":3},{"area":"The Wilds","code":53,"parent":3},{"area":"Woodlands","code":54,"parent":3},{"area":"Ashlea Gardens","code":55,"parent":4},{"area":"Maroelana","code":56,"parent":4},{"area":"Berea","code":57,"parent":4},{"area":"Pretoria Central","code":58,"parent":4},{"area":"Alphen Park","code":59,"parent":4},{"area":"Brooklyn","code":60,"parent":4},{"area":"Erasmusrand","code":61,"parent":4},{"area":"Hatfield","code":62,"parent":4},{"area":"Hazelwood","code":63,"parent":4},{"area":"Lynnwood","code":64,"parent":4},{"area":"Menlo Park","code":65,"parent":4},{"area":"Monument Park","code":66,"parent":4},{"area":"Groenkloof","code":67,"parent":4},{"area":"Lukasrand","code":68,"parent":4},{"area":"Sterreweg","code":69,"parent":4},{"area":"Muckleneuk","code":70,"parent":4},{"area":"Sunnyside","code":71,"parent":4},{"area":"Arcadia","code":72,"parent":4},{"area":"Clydesdale","code":73,"parent":4},{"area":"Waterkloof","code":74,"parent":4},{"area":"Amandasig","code":75,"parent":6},{"area":"Heatherdale","code":76,"parent":6},{"area":"Nina Park","code":77,"parent":6},{"area":"Andeon","code":78,"parent":6},{"area":"Magallies Moot","code":79,"parent":6},{"area":"Kameeldrift West","code":80,"parent":6},{"area":"Soshanguve","code":81,"parent":6},{"area":"Annlin","code":82,"parent":6},{"area":"Wonderboom","code":83,"parent":6},{"area":"Montana Gardens","code":84,"parent":6},{"area":"Derdepoort","code":85,"parent":6},{"area":"Booysens","code":86,"parent":6},{"area":"Suiderberg","code":87,"parent":6},{"area":"Mountain View","code":88,"parent":6},{"area":"Daspoort","code":89,"parent":6},{"area":"CapitalPark","code":90,"parent":6},{"area":"Mayville","code":91,"parent":6},{"area":"Eloffsdal","code":92,"parent":6},{"area":"Gezina","code":93,"parent":6},{"area":"LesMarais","code":94,"parent":6},{"area":"Colbyn","code":95,"parent":6},{"area":"Queenswood","code":96,"parent":6},{"area":"Rietondale","code":97,"parent":6},{"area":"Riviera","code":98,"parent":6},{"area":"Kilner Park","code":99,"parent":6},{"area":"Danville","code":100,"parent":6},{"area":"Elandspoort","code":101,"parent":6},{"area":"Philip Nel Park","code":102,"parent":6},{"area":"Wespark","code":103,"parent":6},{"area":"Doornpoort","code":104,"parent":6},{"area":"Kameeldrift","code":105,"parent":6},{"area":"Roodeplaat Dam","code":106,"parent":6},{"area":"Dorandia","code":107,"parent":6},{"area":"Florauna","code":108,"parent":6},{"area":"Theresa   Park","code":109,"parent":6},{"area":"MontanaPark","code":110,"parent":5},{"area":"Magalieskruin","code":111,"parent":5},{"area":"Sinoville","code":112,"parent":5},{"area":"Orchards","code":113,"parent":5},{"area":"Rosslyn","code":114,"parent":5},{"area":"Clarina","code":115,"parent":5},{"area":"Chantelle","code":116,"parent":5},{"area":"Karen Park","code":117,"parent":5},{"area":"Rietfontein","code":118,"parent":5},{"area":"Villeria","code":119,"parent":5},{"area":"Waverly","code":120,"parent":5},{"area":"Wonderboom South","code":121,"parent":5}];
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