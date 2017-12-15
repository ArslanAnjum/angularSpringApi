(function(angular){

	'use strict';

	/**
	 * @author Arslan Anjum
	 * 
	 * we would fetch everything using detail projection
	 */
	
	var apiWrapperModule = angular.module('apiWrapper',[]);
	
	apiWrapperModule.service('apiWrapper',['$http','api','$timeout','$q',function($http,api,$timeout,$q){
		
		var defaultProjection;
		
		var $scope;
		var page
		var size
		var sort;
		var order;
		var totalPages;
		var hasNext;
		var hasPrevious;
		
		var entityName;
		var searchEntity;
		var searchParm;
		var searchParams;
		var searchParmValue;
		var variableName;
		
		var maxYear;
		var maxMonth;
		var maxDay;
		
		var apiWrapper = function($scope){
			this.$scope = $scope;
			this.defaultProjection = 'detail';
			this.searchParams = new Map();
		}
		
		apiWrapper.prototype.setScope = function(scope){
			this.$scope = scope;
		}
		apiWrapper.prototype.configPagination = function(page,size,sort,order){
			this.page=page;
			this.size=size;
			this.sort=sort;
			this.order=order;
		}
		apiWrapper.prototype.setSearchEntity = function(searchEntity){
			this.searchEntity = searchEntity;
		}
		apiWrapper.prototype.setSearchParams = function (searchParam, searchParamValue){
			this.searchParams.set(searchParam,searchParamValue);
		}
		apiWrapper.prototype.addMoreSearchParams = function(searchParam, searchParamValue){
			this.searchParams.set(searchParam,searchParamValue);
		}
		apiWrapper.prototype.setProjection = function (projection){
			this.defaultProjection = projection;
		}
		apiWrapper.prototype.setVariableName = function(variableName){
			this.variableName = variableName;
		}
		apiWrapper.prototype.setEntityName = function(entityName){
			this.entityName = entityName;
		}
		apiWrapper.prototype.applyMaterialSelect = function(){
			$timeout(function(){
				$('select').material_select();
			},500);
		}
		
		apiWrapper.prototype.applyInitDatePicker = function(){
			var that = this;
			$timeout(function(){
				
				if (!maxYear && !maxMonth && !maxDay){
					$('.datepicker').pickadate({
						selectMonths : true,
						selectYears : 15,
						format : 'yyyy-mm-dd',
						min: [that.maxYear,that.maxMonth,that.maxDay],
						closeOnSelect: true
					});
				}
				else{
					$('.datepicker').pickadate({
						selectMonths : true,
						selectYears : 15,
						format : 'yyyy-mm-dd',
						closeOnSelect: true
					});
				}
				
			},500);
		}
		apiWrapper.prototype.toast = function(msg){
			Materialize.toast(msg, 2500,'blue rounded');
		}
		apiWrapper.prototype.isValid = function(argument){
			if (	argument === undefined || 
					argument === null ||
					argument === ''){
				return false;
			}
			else 
				return true;
		}
		apiWrapper.prototype.fetchReferenceData = function(entityName,callBack){
			var that = this;
			api.getReferenceData(entityName,function(response){
				response = response.data;
				that.$scope[entityName] = response._embedded[entityName];
				if (that.isValid(callBack)){
					callBack(response,entityName);
				}
			});
		}
		apiWrapper.prototype.fetch = function(entityName,projection,callBack){
			var that = this;
			
			if (projection){
				api.getAllWithProjection(entityName,projection,this.$scope,function(response){
					that.$scope[entityName] = response._embedded[entityName];
					if (that.isValid(callBack)){
						callBack(response,entityName);
					}
				});
			}else{
				api.getAllWithProjection(entityName,that.defaultProjection,this.$scope,function(response){
					that.$scope[entityName] = response._embedded[entityName];
					if (that.isValid(callBack)){
						callBack(response,entityName);
					}
				});
			}
		}
		
		
		
		apiWrapper.prototype.fetchSearchEntity = function(entityName){
			var that = this;
			api.getAllWithProjectionWithSearchEntity(entityName,this.searchEntity,that.defaultProjection,this.$scope,function(response){
				that.$scope[entityName] = response._embedded[entityName];
			});
		}
		
		apiWrapper.prototype.fetchSortedPage = function(entityName,callBack){
			var that=this;
			
			var args = new Map();
			if (this.isValid(this.page))
				args.set('page',that.page);
			if (this.isValid(this.size))
				args.set('size',that.size);
			if (this.isValid(this.sort) && this.isValid(this.order))
				args.set('sort',that.sort + ',' + that.order);
			
			if(this.searchParams.size > 0){
				for (var [key,value] of this.searchParams){
					args.set(key,value);
				}
			}
			
			if (that.searchEntity !== null && that.searchEntity !== undefined){
				api.fetchSortedPageWithSearchEntity
				(entityName,
				 that.defaultProjection,
				 that.searchEntity,
				 args,
				 that.$scope,
				 function(response){
					response = response.data;
					if (that.variableName !== null && that.variableName !== undefined && that.variableName !== ''){
						that.$scope[that.variableName] = response._embedded[entityName];
					}else{
						that.$scope[entityName] = response._embedded[entityName];
					}
					
					if (!that.isValid(response._embedded[entityName])){
						that.toast("None Found");
						return;
					}
					if (response._embedded[entityName].length > 0
							&& response._embedded[entityName][0].tomorrow){
						
						var date = new Date(response._embedded[entityName][0].tomorrow);
						
						that.maxYear = date.getFullYear();
						that.maxMonth = date.getMonth();
						that.maxDay = date.getDate();
					}
					that.totalPages = response.page.totalPages;
					that.hasNext = (response._links.next != null);
					that.hasPrevious = (response._links.prev != null);
					that.applyMaterialSelect();
					that.applyInitDatePicker();
					
					if (that.isValid(callBack))
						callBack(response,that.$scope);
				});
			}else{
				api.fetchSortedPage
				(entityName,
				 that.defaultProjection,
				 that.page,
				 that.size,
				 that.sort,
				 that.order,
				 that.$scope,
				 function(response){
					response = response.data;
					if (that.variableName !== null && that.variableName !== undefined && that.variableName !== ''){
						that.$scope[that.variableName] = response._embedded[entityName];
					}else{
						that.$scope[entityName] = response._embedded[entityName];
					}
					
					if (!that.isValid(response._embedded[entityName])){
						that.toast("None Found");
						return;
					}
					
					if (response._embedded[entityName].length > 0
							&& response._embedded[entityName][0].tomorrow){
						
						var date = new Date(response._embedded[entityName][0].tomorrow);
						
						that.maxYear = date.getFullYear();
						that.maxMonth = date.getMonth();
						that.maxDay = date.getDate();
					}
					
					that.totalPages = response.page.totalPages;
					that.hasNext = (response._links.next != null);
					that.hasPrevious = (response._links.prev != null);
					that.applyMaterialSelect();
					that.applyInitDatePicker();
					
					if (that.isValid(callBack))
						callBack(response,that.$scope);
				});
			}
		}
		
		apiWrapper.prototype.fetchNextPage = function(entity,callBack){
			if (this.page + 1 < this.totalPages){
				this.page = this.page + 1;
				this.fetchSortedPage(entity,callBack);
			}
		}

		apiWrapper.prototype.fetchPreviousPage = function(entity,callBack){
			if (this.page > 0){
				this.page = this.page - 1;
				this.fetchSortedPage(entity,callBack);
			}
		}
		
		apiWrapper.prototype.firstPage = function(entity,callBack){
			this.page = 0;
			this.fetchSortedPage(entity,callBack);
		}
		
		apiWrapper.prototype.lastPage = function(entity,callBack){
			this.page = this.totalPages - 1;
			this.fetchSortedPage(entity,callBack);
		}
		
		/**
		 * Fetch object from server and replaces the original one
		 */
		apiWrapper.prototype.syncWithServer = function(object){
			api.getWithProjection(api.getSelfLink(object),that.defaultProjection,this.$scope,function(response){
				object = response;
			})
		}
		/**
		 * updates a collection element.
		 * object				object which holds the foreign entity
		 * foreignEntityName	foreignEntityName
		 * sync					do we have to re fetch this object upon update
		 * fetchEntity			do we have to fetch some other entity
		 * 
		 */
		apiWrapper.prototype.updateForeignEntity = function(	object,
												foreignEntityName,
												sync,
												fetchEntity){
			var that = this;
			api.updateForeignEntity(object,foreignEntityName,object[foreignEntityName],that.$scope,function(response){
				that.toast('Updated');
				if (sync) that.syncWithServer(object);
				if (fetchEntity !== undefined && fetchEntity !== null && fetchEntity !== '')
					that.fetch(fetchEntity);
				that.applyMaterialSelect();
				that.applyInitDatePicker();
			})
		}
		
		
		/**
		 * $event				keyup event object
		 * object				object which we intend to update
		 * propName				objects property which we intend to update
		 * fetchEntity			fetch entity after update has completed successfully
		 * editVariable			variable name which has edit option to control edit mode on front end
		 * editVariableName		variable name which is used in ng-show
		 */
		apiWrapper.prototype.updateOnEnter = function(	$event,
										object,
										propName,
										fetchEntity,
										editVariable,
										editVariableName){
			var that = this;
			
			if ($event.keyCode == 13){
				if (!this.isValid(object[propName])){
					this.toast('Invalid');
					return;
				}
				
				var payload = {};
				payload[propName] = object[propName];
				
				api.updateSelf(object,payload,that.$scope,function(response){
					if (response.status == 200 || response.status == 201){
						that.toast('Updated');
						if (fetchEntity !== undefined && fetchEntity !== null && fetchEntity !== '')
							that.fetch(fetchEntity);
						$timeout(function(){
							api.refreshWithProjection(object,propName,that.$scope);
						},500);
						that.applyMaterialSelect();
						that.applyInitDatePicker();
						if (editVariable !== null && editVariable !== undefined
								&& editVariableName !== null && editVariableName !== undefined && editVariableName !== '')
							editVariable[editVariableName] = false;
					}
				},function(error){
					if (error.status == 409){
						object[propName] = null;
						that.toast('Duplication found. please mention unique ' + propName);
					}
				});
			}
		}
		
		apiWrapper.prototype.refreshWithProjection = function(object,propName,callBack){
			api.refreshWithProjection(object,propName,this.$scope,callBack);
		};
		
		
		/**
		 * $event				keyup event object
		 * itemName				itemName representing this resource in RESTful structure
		 * propName				objects property which we intend to add
		 * newPropName			main variable for new property
		 * newPropSubName		key in main variable which holds actual value
		 * editVariable			variable name which has edit option to control edit mode on front end
		 * editVariableName		variable name which is used in ng-show
		 */
		apiWrapper.prototype.addNewOnEnter = function(	$event,
										itemName,
										propName,
										newPropName,
										editVariable,
										editVariableName,
										ignorePropUpdate){
			var that = this;
			
			
			if($event.keyCode == 13){
				if (!this.$scope[newPropName]){
					this.toast('Please specify ' + propName);
				}
				if (!this.isValid(this.$scope[newPropName][propName])){
					this.toast('Invalid');
					return;
				}
				var payload = {};
				payload[propName] = this.$scope[newPropName][propName];
				
				api.create(itemName,payload,this.$scope,function(response){
					if (response.status == 201 || response.status == 200){
						var selfLink = api.getSelfLink(response.data);
						api.getWithProjection(selfLink,that.defaultProjection,that.$scope,function(response){
							that.$scope[itemName].push(response);
							if (!ignorePropUpdate)
								that.$scope[newPropName][propName] = null;
							that.toast('Created');
							that.applyMaterialSelect();
							that.applyInitDatePicker();
						});
					}
				},
				function(error){
					if (error.status == 409){
						that.$scope[newPropName][propName] = null;
						that.toast('Duplication found. please mention unique ' + propName);
					}
				});
			}
		}	
		
		
		
		/**
		 * $event				keyup event object
		 * itemName				itemName representing this resource in RESTful structure
		 * propName				objects property which we intend to add
		 * newPropName			main variable for new property
		 * newPropSubName		key in main variable which holds actual value
		 * editVariable			variable name which has edit option to control edit mode on front end
		 * editVariableName		variable name which is used in ng-show
		 */
		apiWrapper.prototype.addNewOnClick = function(	$event,
										itemName,
										propName,
										propValue){
			var that = this;
			
			if($event.keyCode == 13){
				if (!this.isValid(propValue)){
					this.toast('Invalid');
					return;
				}
				var payload = {};
				payload[propName] = propValue;
				
				api.create(itemName,payload,that.$scope,function(response){
					if (response.status == 201 || response.status == 200){
						var selfLink = api.getSelfLink(response.data);
						api.getWithProjection(selfLink,that.defaultProjection,that.$scope,function(response){
							that.$scope[itemName].push(response);
							that.applyMaterialSelect();
							that.applyInitDatePicker();
							that.toast('Created');
						});
					}
				},
				function(error){
					if (error.status == 409){
						that.toast('Duplication found. please mention unique ' + propName);
					}
				});
			}
		}
		
		apiWrapper.prototype.addNewCollectionElement = function(	$event,
													parentItem,
													parentItemName,
													itemName,
													propName,
													newProp,
													editVariable,
													editVariableName){
			var that = this;
			
			if ($event.keyCode == 13){
				if (!this.isValid(newProp[propName])){
					this.toast('Invalid');
					return;
				}
				
				editVariable[editVariableName] = false;
				
				var payload = {};
				payload[propName] = newProp[propName];
				
				api.create(itemName,payload,that.$scope,function(response){
					newProp[propName] = null;
					if (response.status == 200 || response.status == 201 || response.status == 204){
						api.addToForeignEntity(parentItem,itemName,response.data,that.$scope,function(response){
							if (response.status == 200 || response.status == 201 || response.status == 204){
								that.fetch(parentItemName);
								that.toast('Created');
							}
						})
					}
				})
			}
		}
		
		
		
		apiWrapper.prototype.delete = function(object,onSuccess,onError){
			
			var that = this;
			
			if (!this.isValid(object)){
				this.toast('Invalid');
				return;
			}
			
			
			api.delete(
					object,
					that.$scope,
					function(){
						that.toast('Deleted');
						onSuccess(that.$scope);
					},
					function(){
						that.toast('Cannot Delete');
					}
				)
		}
		
		apiWrapper.prototype.update = function(entityName,entity,$scope,callBack,errorCallBack){
			var that = this;
			api.update(
			    entityName,
			    entity,
			    $scope,
			    function(response){
			        callBack(response,that.$scope);
			    },
			    errorCallBack);
		}
		apiWrapper.prototype.getProfile = function(entity,onSuccess,onError){
			
			var that = this;
			
			api.getProfile(
					entity,
					function(response){onSuccess(response)},
					function(error){onError(error)}
					);
		}
		
		apiWrapper.prototype.create = function(entityName,entity,$scope,callBack,errorCallBack){
		    var scope = this.$scope;
			api.create(
			    entityName,
			    entity,
			    $scope,
			    function(response){
			        callBack(response,scope);
			    },
			    function(response){
			        errorCallBack(response,scope);
			    }
			    );
		}

		return apiWrapper;
}]);
}(window.angular));