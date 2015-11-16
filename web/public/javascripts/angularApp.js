var app = angular.module('ancientDNA', ['ui.router']);

app.controller('MainCtrl', ['$scope',
    function($scope){
        $scope.test = 'test123';
    }
]);