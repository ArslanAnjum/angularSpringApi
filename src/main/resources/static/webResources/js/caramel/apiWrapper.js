(function(angular){

	'use strict';

	/**
	 * @author Arslan Anjum
	 */

	var apiWrapperModule = angular.module('apiWrapper',[]);

	apiWrapperModule.service('apiWrapper',['$http','api','$timeout','$q',function($http,api,$timeout,$q){

		var projection;

		var $scope;
		var page
		var size
		var sort;
		var order;
		var totalPages;
		var totalElements;
		var hasNext;
		var hasPrevious;
		var doNotUseProjection;
		var selectId;

		/*
		    Passive api means:
		        2- Received Data wont be set on a $scope variable
		*/
		var isItAPassiveApi;

		/*
			SuppressToast
			*/
		var suppressedToast;

		var onSuccessfullSubsequentFetch;
		var fetched;

        var resetOnNoneFound;

		var entityName;
		var collectionName;     //if collection name is something other than entity Name . e.g., api is at logs but would return list of places.
		var searchEntity;
		var searchParams;
		var variableName;
		var loadMoreMode;
		var loadingMore;

		var apiWrapper = function($scope){
			this.$scope = $scope;
			this.projection = 'detail';
			this.searchParams = [];
			this.selectId = 'select';
			this.fetched = 0;
			this.loadMoreMode = false;
			this.loadingMore = false;
		}

		apiWrapper.prototype.configPagination = function(page,size,sort,order){
			this.page=page;
			this.size=size;
			this.sort=sort;
			this.order=order;
			return this;
		}
		/*
		    Configures apiWrapper for fetching reference data
		    page=0;size=200;sort=entityId;order=asc
		*/
		apiWrapper.prototype.configFor200Records = function(collection){
		    this.page=0;
		    this.size=200;
		    this.sort=this.getSingular(collection) + 'Id';
		    this.order='asc';
		    this.entityName = collection;
		    return this;
		}

		/*
		    Configures apiWrapper for fetching data with following params
            page=0;size=20;sort=entityId;order=asc
		*/
		apiWrapper.prototype.configFor20Records = function(collection){
		    this.page=0;
            this.size=20;
            this.sort=this.getSingular(collection) + 'Id';
            this.order='asc';
            this.entityName = collection;
            return this;
		}
		apiWrapper.prototype.withOrder = function(order){
		    this.order = order;
		    return this;
		}
		apiWrapper.prototype.passiveApi = function(){
		    this.isItAPassiveApi = true;
		    return this;
		}

		apiWrapper.prototype.suppressToast = function(){
			this.suppressedToast  = true;
			return this;
		}

		apiWrapper.prototype.withLoadMoreMode = function(){
		    this.loadMoreMode = true;
		    return this;
		}

		apiWrapper.prototype.withResetOnNoneFound = function(){
		    this.resetOnNoneFound = true;
		    return this;
		}
		apiWrapper.prototype.withNoProjection = function(){
		    this.doNotUseProjection = true;
		    return this;
		}
		apiWrapper.prototype.setVariableName = function(variableName){
		    this.variableName = variableName;
		    return this;
		}
		apiWrapper.prototype.setSearchEntity = function(searchEntity){
			this.searchEntity = searchEntity;
			return this;
		}
		apiWrapper.prototype.setSearchParams = function (searchParam, searchParamValue){
		    var obj = {};
		    obj[searchParam] = searchParamValue;
			this.searchParams.push(obj);
			return this;
		}
		apiWrapper.prototype.withSearchParams = function (searchParams){
		    this.searchParams = angular.copy(searchParams);
		    return this;
		}
		apiWrapper.prototype.resetSearchParams = function(){
		    this.searchParams = [];
		    return this;
		}
		apiWrapper.prototype.resetPage = function(){
		    this.page=0;
		    return this;
		}
		apiWrapper.prototype.resetSearchEntity = function(){
		    this.searchEntity = null;
		    return this;
		}
		apiWrapper.prototype.setProjection = function (projection){
			this.projection = projection;
			return this;
		}
		apiWrapper.prototype.setEntityName = function(entityName){
			this.entityName = entityName;
			return this;
		}
		apiWrapper.prototype.setCollectionName = function(collectionName){
		    this.collectionName = collectionName;
		    return this;
		}
		apiWrapper.prototype.setSelectId = function(selectId){
			this.selectId = selectId;
			return this;
		}
		apiWrapper.prototype.setOnSuccessfullSubsequentFetch = function(onSuccessfullSubsequentFetch){
			this.onSuccessfullSubsequentFetch = onSuccessfullSubsequentFetch;
			return this;
		}
		apiWrapper.prototype.applyMaterialSelect = function(){
			$timeout(angular.bind(this,function(){
				$(this.selectId).material_select();
			}),500);
		}
		apiWrapper.prototype.applyInitDatePicker = function(){
			var that = this;
			$timeout(function(){
				$('.datepicker').pickadate({
                    selectMonths : true,
                    selectYears : 15,
                    format : 'yyyy-mm-dd',
                    closeOnSelect: true
                });
			},500);
		}
		apiWrapper.prototype.toast = function(msg){
			Materialize.toast(msg, 2500,'blue rounded');
		}
		apiWrapper.prototype.isValid = function(argument){
			if (	argument === undefined ||
					argument === null ||
					argument === '' ||
					argument.length === 0){
				return false;
			}
			else
				return true;
		}

		/*
		    Fetches reference data for drop downs etc
		    Would check if that data is already present on $scope
		    Would set the data at $scope[entityName]
		*/
		apiWrapper.prototype.fetchReferenceData = function(entityName,onSuccess){

			var that = this;
			if (!that.isValid(that.$scope[entityName])){
			    api.getReferenceData(entityName,function(response){
                    response = response.data;
                    that.$scope[entityName] = response._embedded[entityName];
                    if (that.isValid(onSuccess)){
                        onSuccess(response,entityName);
                    }
                });
			}
		}

		/*
		    Fetches collection with entityName
		    arguments can be
		        page
		        size
		        sort
		        order
		        projection
		        search arguments -> set using setSearchParams
		*/
		apiWrapper.prototype.fetchSortedPage = function(onSuccess,onNoneFound,onError,internalCall){
			var that=this;

			var args = [];

			if (!this.doNotUseProjection)
			    args.push({'projection':this.projection});
            if (this.isValid(this.page))
                args.push({'page':that.page});
            if (this.isValid(this.size))
                args.push({'size':that.size});
            if (this.isValid(this.sort) && this.isValid(this.order))
                args.push({'sort':that.sort + ',' + that.order});

            for (var i=0;i<this.searchParams.length;i++){
                args.push(this.searchParams[i]);
            }

            api.fetchSortedPage(
                that.entityName,
                that.searchEntity,
                args,
                that.$scope,
                function(response){
                   response = response.data;
                   var collectionName = that.collectionName == undefined ? that.entityName : that.collectionName;

                   var noneFound = false;
                   if (!that.isValid(response._embedded[collectionName])){
                       if (!that.isItAPassiveApi){
                            if (that.resetOnNoneFound){
                                if (that.isValid(that.variableName))
                                    that.$scope[that.variableName] = [];
                                else
                                    that.$scope[that.entityName] = [];
                            }
                        }

                        if (!that.suppressedToast){
                            that.toast("None Found");
                        }

                       noneFound = true;

                   }else{
                       if (!that.isItAPassiveApi){
                           if (that.isValid(that.variableName)){
                                if (that.loadMoreMode && that.page > 0){
                                    let lst = that.$scope[that.variableName];
                                    let key = that.getSingular(collectionName) + "Id";
                                    let lastId = lst[lst.length - 1][key];

                                    let receivedLst = response._embedded[collectionName];

                                    for (let i=0; i<receivedLst.length; i++){
                                        if (receivedLst[i][key] < lastId){
                                            lst.push(receivedLst[i]);
                                        }
                                    }

                                } else {
                                    that.$scope[that.variableName] = response._embedded[collectionName];
                                }
                           }
                           else {
                                if (that.loadMoreMode && that.page > 0){
                                    let lst = that.$scope[that.entityName];
                                    let key = that.getSingular(collectionName) + "Id";
                                    let lastId = lst[lst.length - 1][key];

                                    let receivedLst = response._embedded[collectionName];

                                    for (let i=0; i<receivedLst.length; i++){
                                        if (receivedLst[i][key] < lastId){
                                            lst.push(receivedLst[i]);
                                        }
                                    }
                                } else {
                                    that.$scope[that.entityName] = response._embedded[collectionName];
                                }

                           }
                       }
                   }

                   if (!that.isItAPassiveApi){
                       that.totalPages = response.page.totalPages;
                       that.totalElements = response.page.totalElements;
                       that.hasNext = (response._links.next != null);
                       that.hasPrevious = (response._links.prev != null);
                       that.applyMaterialSelect();
                       that.applyInitDatePicker();
                   }

                   if (noneFound){
                        if (that.isValid(onNoneFound)) onNoneFound(response,that.$scope,that);
                   }else{
                        if (that.isValid(onSuccess)) onSuccess(response,that.$scope,that);

                    if (that.isValid(that.onSuccessfullSubsequentFetch) && that.fetched > 0) that.onSuccessfullSubsequentFetch(response, that.$scope, that);
                            that.fetched++;
                   }

                   that.loadingMore = false;
               },
               function(error){
                   if (!that.isItAPassiveApi){
                       that.totalPages = null;
                       that.totalElements = null;
                       that.hasNext = null;
                       that.hasPrevious = null
                       that.applyMaterialSelect();
                       that.applyInitDatePicker();
                   }
                   if (that.isValid(onError)) onError(error,$scope,that);

                   that.loadingMore = false;
               }
            );
		}


		/*Pagination Functions*/
		apiWrapper.prototype.fetchNextPage = function(){
			if (this.page + 1 < this.totalPages){
				this.page = this.page + 1;
				this.fetchSortedPage();
			}
		}
		apiWrapper.prototype.fetchPreviousPage = function(){
			if (this.page > 0){
				this.page = this.page - 1;
				this.fetchSortedPage();
			}
		}
		apiWrapper.prototype.firstPage = function(){
			this.page = 0;
			this.fetchSortedPage();
		}
		apiWrapper.prototype.lastPage = function(){
			this.page = this.totalPages - 1;
			this.fetchSortedPage();
		}

		apiWrapper.prototype.loadMore = function(){
		    if (!this.loadingMore){
		        this.loadingMore = true;
		    } else {
		        return;
		    }
            if (this.page + 1 < this.totalPages){
                this.page = this.page + 1;
                this.fetchSortedPage();
            }
        }

        apiWrapper.prototype.updateListWithId = function(id){

            var that = this;
            $http
            .get('/api/' + that.entityName + '/' + id + '?projection=' + that.projection)
            .then (
                function(response){
                    let newObj = response.data;
                    let $scope = that.$scope;
                    let lst = that.variableName ? $scope[that.variableName] : $scope[that.entityName];
                    lst.unshift(newObj);

                    if (lst.length % that.size == 1 && that.page > 0){
                        that.totalPages++;
                    }
                }
            )
        }

        apiWrapper.prototype.updateListWithIdAtEnd = function(id){

            var that = this;
            $http
            .get('/api/' + that.entityName + '/' + id + '?projection=' + that.projection)
            .then (
                function(response){
                    let newObj = response.data;
                    let $scope = that.$scope;
                    let lst = that.variableName ? $scope[that.variableName] : $scope[that.entityName];
                    lst.push(newObj);

                    if (lst.length % that.size == 1 && that.page > 0){
                        that.totalPages++;
                    }
                }
            )
        }


        apiWrapper.prototype.updateListWithObj = function(newObj){

            var that = this;
            let $scope = that.$scope;
            let lst = that.variableName ? $scope[that.variableName] : $scope[that.entityName];
            lst.unshift(newObj);

            if (lst.length % that.size == 1 && that.page > 0){
                that.totalPages++;
            }
        }

        apiWrapper.prototype.updateIndividualById = function(id){

            var that = this;
            let $scope = that.$scope;
            let lst = that.variableName ? $scope[that.variableName] : $scope[that.entityName];
            let key = that.getSingular(that.entityName) + "Id";

            for (let i=0; i<lst.length; i++){
                if (lst[i][key] == id){

                    $http
                    .get('/api/' + that.entityName + '/' + id + '?projection=' + that.projection)
                    .then(
                        angular.bind(id, function(response){

                            for (let j=0; j<lst.length; j++){
                                if (lst[j][key] == this){
                                    lst[j] = angular.copy(response.data);
                                }
                            }

                        })
                    )
                }
            }
        }


        apiWrapper.prototype.addActive = function(id){
            var that = this;
            let $scope = that.$scope;
            let lst = that.variableName ? $scope[that.variableName] : $scope[that.entityName];
            let key = that.getSingular(that.entityName) + "Id";

            if (lst.length > 0){
                let max = lst[0][key];
                let min = lst[lst.length - 1][key];

                if (id > max){
                    that.updateListWithId(id);
                } else if (id < min){
                    if (lst.length % that.size == 0){
                        that.totalPages++;
                    } else {
                        that.updateListWithIdAtEnd(id);
                    }
                } else {
                    that.updateIndividualById(id);
                }
            }
        }

        apiWrapper.prototype.removeInactive = function(id){

            var that = this;
            let $scope = that.$scope;
            let lst = that.variableName ? $scope[that.variableName] : $scope[that.entityName];
            let key = that.getSingular(that.entityName) + "Id";

            if (lst.length > 0){
                let max = lst[0][key];
                let min = lst[lst.length - 1][key];

                for (let i=0; i<lst.length; i++){
                    if (lst[i][key] == id){
                        lst.splice(i,1);
                        if (lst.length % that.size == 0){
                            if (that.page > 0){
                                that.page--;
                            }
                        }
                        break;
                    }
                }
            }
        }

        /*************************************/

		apiWrapper.prototype.getProfile = function(onSuccess,onError){

            var that = this;

            api.getProfile(
                    that.entityName,
                    function(response){onSuccess(response,that.$scope,that)},
                    function(error){onError(error)}
                    );
        }

        apiWrapper.prototype.create = function(entity,$scope,callBack,errorCallBack){
            var scope = this.$scope;
            var that = this;
            api.create(
                that.entityName,
                entity,
                $scope,
                function(response){
                    if (that.isValid(callBack))
			    callBack(response,scope);
                },
                function(response){
	            if (that.isValid(errorCallBack))
                           errorCallBack(response,scope);
                }
                );
        }

        apiWrapper.prototype.update = function(entity,$scope,callBack,errorCallBack){
            var that = this;
            api.update(
                that.entityName,
                entity,
                $scope,
                function(response){
                    if (that.isValid(callBack))
			    callBack(response,that.$scope);
                },
                errorCallBack);
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
						if (that.isValid(onSuccess))
							onSuccess(that.$scope);
					},
					function(){
						that.toast('Cannot Delete');
					}
				)
		}

		apiWrapper.prototype.getSingular = function (entity){
            var iesIndex = entity.lastIndexOf('ies');
            var esIndex = entity.lastIndexOf('es');
            var length = entity.length;

            if (iesIndex != -1 && iesIndex + 3 == length){
                return entity.substring(0,iesIndex) + 'y';
            }else if (esIndex != -1 && iesIndex + 2 == length){
                return entity.substring(0,esIndex);
            }else{
                return entity.substring(0,entity.length-1);
            }
        }

		return apiWrapper;
}]);
}(window.angular));

