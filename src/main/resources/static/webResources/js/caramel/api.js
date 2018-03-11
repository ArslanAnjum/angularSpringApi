(function(angular){
	'use strict';

	/**
	 * Assumptions: 1-spring api is configured at server-root/api/**
	 * 
	 */
	var apiModule = angular.module('api',[]);
	
	apiModule.service('api',
			['$http','$timeout',function($http,$timeout){
				
				var pathname = window.location.pathname;
				var pathnameWithoutSlash = pathname.substring(1,pathname.length);
				var slashIndex = pathnameWithoutSlash.indexOf('/')
				if (slashIndex){
					pathname = pathname.substring(0,slashIndex + 1);
				}
				var baseUrl = pathname + '/api/';

				this.getReferenceData = function(entityName,onSuccess,onError){
					var url = baseUrl + entityName + '?page=0&size=200';
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
						
				}
				
				this.getProfile = function(entity,onSuccess,onError){
					var that = this;
					var url = baseUrl + '/profile/' + entity;
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
				}

				this.fetchSortedPage = function(
                    entity,
                    searchEntity,
                    args,
                    $scope,
                    onSuccess,
                    onError){

                    var url = baseUrl + entity;
                    if (searchEntity){
                        url+='/search/';
                        url+=searchEntity;
                    }
                    for (var i=0;i<args.length;i++){
                        if (i==0) url+='?';
                        for(var prop in args[i]){
                            url+=(prop+'='+args[i][prop]);
                        }
                        if (i+1!=args.length)url+='&';
                    }

                    $http
                        .get(url,this.configContentUndefined())
                        .then(onSuccess,onError);
                }

				this.create = function(entityName,entity,$scope,onSuccess,onError){
					var url= baseUrl + entityName;
					var that = this;
					var headers = [];
					headers['Content-Type'] = 'application/json';
					if ($scope.csrfHeaderName && $scope.csrfHeaderName != ''){
                        headers[$scope.csrfHeaderName] = $scope.csrfToken;
                    }

					$http.post(url,JSON.stringify(entity),{
                        transformRequest : angular.identity,
                        headers : headers
                    })
                    .then(onSuccess,onError);

				}

				this.update = function(entityName,entity,$scope,onSuccess,onError){

					var headers = [];
					headers['Content-Type'] = 'application/merge-patch+json';
					if ($scope.csrfHeaderName && $scope.csrfHeaderName != ''){
					    headers[$scope.csrfHeaderName] = $scope.csrfToken;
					}

					
					$http.patch(
					    this.getSelfLink(entity),
					    JSON.stringify(entity),
					    {
						    transformRequest : angular.identity,
						    headers : headers
					    }
                    )
					.then(onSuccess,onError);
				}
				
				this.delete = function(object,$scope,onSuccess,onError){
					
					var url = this.getSelfLink(object)
					var headers = [];
					if ($scope.csrfHeaderName && $scope.csrfHeaderName != ''){
                        headers[$scope.csrfHeaderName] = $scope.csrfToken;
                    }
					
					$http.delete(
					    this.getSelfLink(object),
					    {
						    transformRequest : angular.identity,
						    headers : headers
					    }
                    )
					.then(onSuccess,onError);
				}

				this.getSelfLink = function(object){
					var url = object._links.self.href;
					var projectionIndex = url.indexOf('{');
                    if (projectionIndex > 0){
                        url = url.substring(0,projectionIndex);
                    }
                    var index = url.indexOf(pathname);
                    url = url.substring(index,url.length);
                    return url;
				}
				this.configContentUndefined = function(){
					return	{	transformRequest : angular.identity,
								headers : {'Content-Type' : undefined}
					 	   	};
				}
			}]);
}(window.angular));
