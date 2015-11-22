//Switch to anonymous pattern + split into seperate files

var app = angular.module('ancientDNA', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
            });
        $urlRouterProvider.otherwise('home');
    }
]);
            
                   

app.controller('MainCtrl', ['$scope',
    function($scope){
        $scope.test = 'test123';
    }
]);