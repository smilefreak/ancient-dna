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
                controller: 'AccCtrl',
                resolve: {
                  accountJobs: ['jobs', function(jobs){
                    return jobs.getAccJobs()
                  }]
                }
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
        $scope.logout = auth.logOut;
    }
])
.controller('AccCtrl', ['$scope', 'accountJobs',
    function($scope, accountJobs){
      var oldJobDate = new Date();
      $scope.oldJobs = [];
      $scope.curJobs = [];
      oldJobDate.setDate(oldJobDate.getDate() - 14);
      accountJobs.results.forEach(function(job){
          if(new Date(job.updatedAt) > oldJobDate){
            $scope.curJobs.push(job);
          }else{
            $scope.oldJobs.push(job);
          }
      });
      console.log($scope.curJobs);
      console.log($scope.oldJobs);
      $scope.accountJobs = accountJobs;
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
        $scope.jNo = jobResults.id;
    }
])
.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    console.log("Attempting to register");
    auth.register($scope.user).error(function(error){
      if(error.errors){
        $scope.error = error.errors[0].message;
      } else {
        $scope.error = error; 
      }
      console.log(error);
    }).then(function(){
      $('#registerModal').modal('hide');
      $state.go('account');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $('#loginModal').modal('hide');
      $state.go('account');
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
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() /1000;
    }else{
      return false;
    }
  }
  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.name;
    }
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
.factory('jobs', ['$http', 'auth', function($http, auth){
    var o = {};
    o.getResults = function(jNo){
        return $http.get('/job/' + jNo + '/fetchResults').then(function(res){
            return res.data;   
        });
    };
    o.getAccJobs = function(){
        return $http.get('/account', {
          headers: {
            Authorization: 'Bearer '+ auth.getToken()
          }
        }).then(function(res){
            return res.data;
        });
    };
    return o;
}])