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
				
				this.getAllWithProjection = function(entity,projection,$scope,onSuccess,onError){
					var url;
					if (!projection) 
						url = baseUrl + entity;
					else 
						url = baseUrl + entity + '/?projection=' + projection;
					
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
				}
				
				this.getAllWithProjectionWithSearchEntity = function(
						entity,
						searchEntity,
						projection,
						$scope,
						onSuccess,
						onError){
				
					var url;	
					if (!projection) 
						url = baseUrl + entity + '/' + searchEntity;
					else 
						url = baseUrl + entity + '/' + searchEntity + '/?projection=' + projection;
					
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
				}
				
				this.fetchSortedPage = function(	entity,
													projection,
													page,
													size,
													sort,
													order,
													$scope,
													onSuccess,onError){
					
					
					var url;
					
					if (!projection) 
						url = baseUrl + entity;
					else 
						url = 	baseUrl + 
								entity + 
								'?page=' + page +
								'&size=' + size +
								'&sort=' + sort +
								',' + order +
								'&projection=' + projection;
					
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
				}
				
				
				this.fetchSortedPageWithSearchEntity = function(	
						entity,
						projection,
						searchEntity,
						args,
						$scope,
						onSuccess,onError){

						var fd = new FormData();
						var that = this;
						fd.append($scope.csrfParamName, $scope.csrfToken);
						
						var url;
						
						if (!projection) 
						url = baseUrl + entity;
						else {
							url = 	baseUrl + 
							entity + 
							'/search/' +
							searchEntity + 
							'?projection=' + projection +
							'&';
							
							var argsLength = args.size;
							var i=0;
							for (var [key,value] of args){
								url=url+key+'='+value;
								i=i+1;
								if (i<argsLength){
									url=url+'&';
								}
							}
						}
						
						
						$http
							.get(url,this.configContentUndefined())
							.then(onSuccess,onError);
				}
				
				this.getAll = function(entity,$scope,onSuccess,onError){
			
					var url = baseUrl;
					url = url + entity;
					
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
						
				}
				this.getAllChilds = function(object,foreignEntityName,onSuccess,onError){
					var url = this.getLink(foreignEntityName,object);
					
					$http
						.get(url,this.configContentUndefined())
						.then(onSuccess,onError);
				}
				this.create = function(entityName,entity,$scope,onSuccess,onError){
					var url= baseUrl + entityName;
					
					var fd = new FormData();
					var that = this;
					fd.append($scope.csrfParamName, $scope.csrfToken);
					
					for (var prop in entity)
						fd.append(prop,entity[prop]);
					
					var headerz = [];
					headerz['Content-Type'] = 'application/json';
					headerz[$scope.csrfHeaderName] = $scope.csrfToken;
					
					$http.post(url,JSON.stringify(entity),{
						transformRequest : angular.identity,
						headers : headerz
					})
					.then(onSuccess,onError);
				}
				this.updateSelf = function(object,payload,$scope,onSuccess,onError){
					
					var url = this.getSelfLink(object)
					var projectionIndex = url.indexOf('{');
					
					if (projectionIndex > 0){
						url = url.substring(0,projectionIndex);
					}
					var headerz = [];
					headerz['Content-Type'] = 'application/hal+json';
					headerz[$scope.csrfHeaderName] = $scope.csrfToken;
					
					$http.patch(url,JSON.stringify(payload),{
						transformRequest : angular.identity,
						headers : headerz
					})
					.then(onSuccess,onError);
				}
				
				this.refreshWithProjection = function(object,propName,$scope,onSuccess,onError){
					var url = this.getSelfLink(object);
					
					var projectionIndex = url.indexOf('{');
					if (projectionIndex > 0){
						url = url.substring(0,projectionIndex);
					}
					url=url+'?projection=detail';
					
					$http
						.get(url,this.configContentUndefined())
						.success(function(response){
									if (propName === null || propName === undefined || propName === '')
										angular.copy(response,object);
									else{
										if (response[propName] !== object[propName])
											angular.copy(response[propName],object[propName]);
									}
									
									if (!onSuccess) onSuccess(response);
						})
						.error(onError);
				}
				
				this.updateForeignEntity = function(object, foreignEntityName, foreignEntity, $scope,onSuccess,onError){
					var url = this.getLink(foreignEntityName,object);
					var projectionIndex = url.indexOf('{');
					if (projectionIndex > 0){
						url = url.substring(0,projectionIndex);
					}
					var foreignEntityUrl = this.getSelfLinkAbsolute(foreignEntity);
					
					$http.put(url,foreignEntityUrl,this.getForeignEntityUpdateConfig($scope))
						 .then(onSuccess,onError);
					
				}
				
				this.update = function(entityName,entity,$scope,onSuccess,onError){
					
					var url = this.getSelfLink(entity)
					var projectionIndex = url.indexOf('{');
					
					if (projectionIndex > 0){
						url = url.substring(0,projectionIndex);
					}
					
					var that = this;
					
					var headerz = [];
					headerz['Content-Type'] = 'application/merge-patch+json';
					headerz[$scope.csrfHeaderName] = $scope.csrfToken;
					
					$http.patch(url,JSON.stringify(entity),{
						transformRequest : angular.identity,
						headers : headerz
					})
					.then(onSuccess,onError);
				}
				this.addToForeignEntity = function(object, foreignEntityName, foreignEntity, $scope,onSuccess,onError){
					var url = this.getLink(foreignEntityName,object);
					var projectionIndex = url.indexOf('{');
					if (projectionIndex > 0){
						url = url.substring(0,projectionIndex);
					}
					var foreignEntityUrl = this.getSelfLinkAbsolute(foreignEntity);
					
					$http
						.post(url,foreignEntityUrl,this.getForeignEntityUpdateConfig($scope))
						.then(onSuccess,onError);
					
				}
				this.get = function(url,$scope,onSuccess,onError){
					var that = this;
					
					$http
						.get(this.getRelativeLink(url),this.configContentUndefined())
						.then(onSuccess,onError);
				}
				
				this.getWithProjection = function(url,projection,$scope,onSuccess,onError){
					var that = this;
					
					$http
						.get(url + '/?projection=' + projection,this.configContentUndefined())
						.then(onSuccess,onError);
				}
				
				this.delete = function(object,$scope,onSuccess,onError){
					
					var url = this.getSelfLink(object)
					var projectionIndex = url.indexOf('{');
					
					if (projectionIndex > 0){
						url = url.substring(0,projectionIndex);
					}
					var headerz = [];
					headerz[$scope.csrfHeaderName] = $scope.csrfToken;
					
					$http.delete(url,{
						transformRequest : angular.identity,
						headers : headerz
					})
					.then(onSuccess,onError);
				}
				
				this.getEmbedded = function (entity,response){
					return response._embedded[entity];
				}
				this.getLink = function(entity,object){
					var url = object._links[entity].href;
					return this.getRelativeLink(url);
				}
				this.getSelfLinkAbsolute = function(object){
					return object._links.self.href;
				}
				this.getSelfLink = function(object){
					var selfLink = object._links.self.href;
					return this.getRelativeLink(selfLink);
				}
				this.getRelativeLink = function(url){
					var dmappIndex = url.indexOf(pathname);
					url = url.substring(dmappIndex,url.length);
					return url;
				}
				this.getUpdateConfig = function($scope){
					var headers = [];
					headers['Content-Type'] = 'application/hal+json';
					headers[$scope.csrfHeaderName] = $scope.csrfToken;
					
					var config = {
						transformRequest : angular.identity,
						headers : headers
					}
					
					return config;
				}
				this.getForeignEntityUpdateConfig = function($scope){
					var headers = [];
					headers['Content-Type'] = 'text/uri-list';
					headers[$scope.csrfHeaderName] = $scope.csrfToken;
					
					var config = {
						transformRequest : angular.identity,
						headers : headers
					}
					
					return config;
				}
				this.configContentUndefined = function(){
					return	{	transformRequest : angular.identity,
								headers : {'Content-Type' : undefined}
					 	   	};
				}
			}]);
}(window.angular));