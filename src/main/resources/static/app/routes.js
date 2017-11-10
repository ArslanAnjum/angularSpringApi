'use strict';

app.config(function ($routeProvider) {
        $routeProvider
        .when('/',{
        	templateUrl : 'persons'
        })
        .when('/persons',{
        	templateUrl : 'persons'
        });
});