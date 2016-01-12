//Switch to anonymous pattern + split into seperate files

var app = angular.module('ancientDNA', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.ejs',
        controller: 'MainCtrl'
      })
      .state('newJob', {
        url: '/newJob',
        templateUrl: '/newJob.ejs',
        controller: 'NewJobCtrl'
      })
      .state('account', {
        url: '/account',
        templateUrl: '/account.ejs',
        controller: 'AccCtrl',
        resolve: {
          jNo: ['$stateParams', function ($stateParams) {
            return $stateParams.jNo;
          }]
        }
      })
      //add jobNo is real job at later points
      .state('jobResults', {
        url: '/job/{jNo}/results',
        templateUrl: '/results.ejs',
        controller: 'ResultCtrl',
        resolve: {
          jobResults: ['$stateParams', 'jobs', function ($stateParams, jobs) {
            return jobs.getResults($stateParams.jNo);
                    }]
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function ($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
              }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.ejs',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function ($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
              }]
      })
    $urlRouterProvider.otherwise('home');
    }
]);



app.controller('MainCtrl', ['$scope', '$timeout', 'auth',
    function ($scope, $timeout, auth) {
      $scope.test = 'test123';
      //      if(!$scope.messages){
      //        $scope.messages = {};
      //      }
      $scope.currentUser = auth.currentUser;
      $scope.loggedIn = auth.isLoggedIn;
      $scope.logout = auth.logOut;
      $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
          $scope.loadWheel = true;
        }
      });
      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
          $timeout(function () {
            $scope.loadWheel = false;
          }, 1000);
        }
      });
      $scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (toState.resolve) {
          $timeout(function () {
            $scope.loadWheel = false;
          }, 1000);
          //add error wheel and present error to user, add fade
        }
      });
    }
])
  .controller('NewJobCtrl', ['$scope', '$state', 'jobs',
    function ($scope, $state, jobs) {
      $scope.addJob = function () {
        console.log("Attempting to add job");
        jobs.addJob($scope.nJob).error(function (error) {
          if (error.errors) {
            $scope.error = error.errors[0].message;
          } else {
            $scope.error = error;
          }
          console.log(error);
        }).then(function () {
          $state.go('account');
        });
      }
    }
])
  .controller('AccCtrl', ['$scope', '$interval', 'jobs', 'jNo',
    function ($scope, $interval, jobs, jNo) {
      var refreshJobFunc = function () {
        jobs.getAccJobs(jNo).then(
          function (accountJobs) {
            var oldJobDate = new Date();
            $scope.oldJobs = [];
            $scope.curJobs = [];
            oldJobDate.setDate(oldJobDate.getDate() - 14);
            accountJobs.results.forEach(function (job) {
              switch (job.status) {
              case "Complete":
                job.labelStyle = "btn-success";
                job.progressStyle = "progress-success";
                break;
              case "Processing":
                job.labelStyle = "btn-primary";
                break;
              case "Paused":
                job.labelStyle = "btn-warning";
                job.progressStyle = "progress-warning";
                break;
              case "Failed":
                job.labelStyle = "btn-danger";
                job.progressStyle = "progress-danger";
                break;
              }
              if (new Date(job.updatedAt) > oldJobDate) {
                $scope.curJobs.push(job);
              } else {
                $scope.oldJobs.push(job);
              }
            });
            console.log($scope.curJobs);
            console.log($scope.oldJobs);
            $scope.accountJobs = accountJobs;
          });
      }
      refreshJobFunc();
      var refreshJobs = $interval(refreshJobFunc, 10000);
      $scope.$on("$destroy", function () {
        console.log("Cancelling autojob refresh");
        $interval.cancel(refreshJobs);
      });
    }
])
  .controller('ResultCtrl', ['$scope', '$stateParams', 'jobs', 'jobResults',
    function ($scope, $stateParams, jobs, jobResults) {
      console.log(jobResults);
      //        $scope.jobResults = jobResults;
      var x = {
        name: jobResults.base_path
      };
      iterateNodes = function (data, depth, curNode) {
        Object.keys(data).forEach(function (key) {
          if (typeof data[key] === 'number') {
            if (!curNode.curLevel) {
              curNode.curLevel = [];
            }
            curNode.curLevel.push({
              name: key,
              size: data[key],
              depth: depth
            });
          } else {
            if (!curNode.nextLevel) {
              curNode.nextLevel = [];
            }
            var q = {
              name: key
            };
            curNode.nextLevel.push(q);
            iterateNodes(data[key], depth + 1, q);
          }
        });
      };
      iterateNodes(jobResults.files, 0, x);
      console.log(x);
      $scope.level = x;
      $scope.jNo = jobResults.id;
    }
])
  .controller('AuthCtrl', ['$scope', '$state', 'auth', function ($scope, $state, auth) {
    $scope.user = {};
    $scope.message = {};

    $scope.register = function () {
      console.log("Attempting to register");
      auth.register($scope.user).error(function (error) {
        $scope.message.r = error;
      }).then(function (data) {
        $scope.message.r = {};
        $('#registerModal').modal('hide');
        $state.go('account');
      });
    };

    $scope.logIn = function () {
      auth.logIn($scope.user).error(function (error) {
        $scope.message.l = error;
      }).then(function () {
        $scope.message.l = {};
        $('#loginModal').modal('hide');
        $state.go('account');
      });
    };
}])

app.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};

    auth.saveToken = function (token) {
      $window.localStorage['adna-token'] = token;
    };
    auth.getToken = function () {
      return $window.localStorage['adna-token'];
    }
    auth.isLoggedIn = function () {
      var token = auth.getToken();
      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    }
    auth.currentUser = function () {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.name;
      }
    }
    auth.register = function (user) {
      return $http.post('/register', user).success(function (data) {
        auth.saveToken(data.token);
      });
    };
    auth.logIn = function (user) {
      return $http.post('/login', user).success(function (data) {
        auth.saveToken(data.token);
      });
    };
    auth.logOut = function () {
      $window.localStorage.removeItem('adna-token');
    }

    return auth;
}])
  .factory('jobs', ['$http', 'auth', function ($http, auth) {
    var o = {};
    o.getResults = function (jNo) {
      return $http.get('/job/' + jNo + '/fetchResults').then(function (res) {
        return res.data;
      });
    };
    o.getAccJobs = function () {
      return $http.get('/account', {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).then(function (res) {
        return res.data;
      });
    };
    o.addJob = function (job) {
      return $http.post('/newJob', job, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    };
    return o;
  }])