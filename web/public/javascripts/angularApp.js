//Switch to anonymous pattern + split into seperate files

var app = angular.module('ancientDNA', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.ejs',
                controller: 'MainCtrl'
            })
            .state('newJob', {
                url: '/newJob',
                templateUrl: '/newJob.ejs',
                controller: 'MainCtrl'
            })
            .state('account', {
                url: '/account',
                templateUrl: '/account.ejs',
                controller: 'MainCtrl'
            })
        //add jobNo is real job at later points
            .state('jobResults', {
                url: '/job/{jNo}/results',
                templateUrl: '/results.ejs',
                controller: 'JobCtrl',
                resolve: {
                    jobResults: ['$stateParams', 'jobs', function($stateParams, jobs){
                        return jobs.getResults($stateParams.jNo);
                    }]
                }
            })
            .state('login', {
              url: '/login',
              templateUrl: '/login.html',
              controller: 'AuthCtrl',
              onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                  $state.go('home');
                }
              }]
            })
            .state('register', {
              url: '/register',
              templateUrl: '/register.ejs',
              controller: 'AuthCtrl',
              onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                  $state.go('home');
                }
              }]
            })
        $urlRouterProvider.otherwise('home');
    }
]);
            
                   

app.controller('MainCtrl', ['$scope', 'auth',
    function($scope, auth){
        $scope.test = 'test123';
        $scope.currentUser = auth.currentUser;
        $scope.loggedIn = auth.isLoggedIn;
    }
])
.controller('JobCtrl', ['$scope', '$stateParams', 'jobs', 'jobResults',
    function($scope, $stateParams, jobs, jobResults){
        console.log(jobResults);
//        $scope.jobResults = jobResults;
        var x = { name: jobResults.base_path };
        iterateNodes = function(data, depth, curNode) {
            Object.keys(data).forEach(function(key){
                if(typeof data[key] === 'number'){
                    if(!curNode.curLevel){
                        curNode.curLevel = [];   
                    }
                    curNode.curLevel.push({
                        name: key,
                        size: data[key],
                        depth: depth
                    });
                } else {
                    if(!curNode.nextLevel){
                        curNode.nextLevel = [];   
                    }
                    var q = { name: key };
                    curNode.nextLevel.push(q);
                    iterateNodes(data[key], depth+1, q);   
                }
            });
        };
        iterateNodes(jobResults.files, 0, x);
        console.log(x);
        $scope.level = x;
        $scope.jNo = jobResults.job_id;
    }
])
.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    console.log("Attempting to register");
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

  auth.saveToken = function (token){
    $window.localStorage['adna-token'] = token;
  };
  auth.getToken = function (){
    return $window.localStorage['adna-token'];
  }
  auth.isLoggedIn = function(){
    var token = auth.getToken();
    if(token){
        console.log("we have an expired token?!");
      var payload = JSON.parse($window.atob(token.split('.')[1]));
        console.log(payload);
      return payload.exp > Date.now() /1000;
    }else{
      return false;
    }
  }
  auth.currentUser = function(){
    //if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.email;
    //}
  }
  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logOut = function(){
    $window.localStorage.removeItem('adna-token');
  }

  return auth;
}])
.factory('jobs', ['$http', function($http){
    var o = {};
    o.getResults = function(jNo){
        return $http.get('/job/' + jNo + '/fetchResults').then(function(res){
            return res.data;   
        });
    };
    return o;
}])