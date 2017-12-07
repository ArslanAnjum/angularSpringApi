'use strict';

app.config(function ($routeProvider) {
        $routeProvider
        .when('/',{
        	templateUrl : 'crud/persons'
        })
        .when('/crud/:entity',{
            templateUrl : function(param){
                return 'crud/' + param.entity;
            }
        });
});