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
            })
        $urlRouterProvider.otherwise('home');
    }
]);
            
                   

app.controller('MainCtrl', ['$scope',
    function($scope){
        $scope.test = 'test123';
    }
])
.controller('JobCtrl', ['$scope', '$stateParams',
    function($scope, $stateParams){
        $scope.jNo = $stateParams.jNo;   
    }
]);