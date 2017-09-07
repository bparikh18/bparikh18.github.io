// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// URL mapping - configure routes to create a single page app
weatherApp.config(function ($routeProvider) {   
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
});

// SERVICES
weatherApp.service('cityService', function() {
    this.city = "Baltimore, MD"; // Default city
});

// CONTROLLERS
weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {
    $scope.city = cityService.city;
    
    $scope.$watch('city', function() {
       cityService.city = $scope.city; 
    });
    
    // Handle submit action
    $scope.submit = function() {
        $location.path("/forecast");
    };
    
}]);


// Custom filter to capitalize first letter
weatherApp.filter('capitalize', function() {
    return function(text) {
        if(!!text) {
            var words = text.split(" ");
            for (i = 0; i < words.length; i++) { 
                words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1).toLowerCase();
            }
            text = words.join(" ");
        }
        return text || '';
    }
});

// Controller to get the forecast
weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {    
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '1';
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast?appid=0dcf12fdc275da72b1e60d38ff19ceca", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days * 8, units: "imperial" });
    
    $scope.convertToDate = function(dt) { 
        return new Date(dt * 1000);
    };
    
}]);