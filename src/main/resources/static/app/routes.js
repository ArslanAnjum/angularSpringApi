'use strict';

app.config(function ($routeProvider) {
        $routeProvider
        .when('/',{
        	templateUrl : 'crud/persons'
        })
        .when('/crud/:entity',{
            templateUrl : function(param){
                return 'crud/' + param.entity;
            },
            controller : function(param,$http){
                $http
                .get('/app/controllers/' + param.entity + 'Controller.js')
                .then(
                    function(response){
                        return response.data;
                    },
                    function(response){
                        return $q.reject(response.data);
                    }
                  );
            }
        });
});