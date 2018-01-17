(function(angular){

	'use strict';

	var apiDataTableModule = angular.module('apiDataTable',[]);
	
	apiDataTableModule.service('apiDataTable',['apiWrapper','$timeout',function(apiWrapper,$timeout){
		
		var $scope;
		var apiWrapper;
		var name;
		var entity;
		var	singularEntity;
		var parentDiv;
		var metadata;
		var headings;
		var tds;
		var paginator;
		var editDiv;
		var editModal;
		var editModalBody;
		var editEntity;
		var deleteEntity;
		var editEntityCopy;
		var eidtModalBuilt;
		var deleteConfirmationDiv;
		var deleteConfirmationModal;
		var form;
		var rows;
		var cols;
		var inputs;
		var searchTerms;
		var pageSize;

		var apiDataTable = function($scope,entity,metadata,defaultPageSize){
			this.$scope = $scope;
			this.name = entity + 'DataTable';
			this.entity = entity;
			this.metadata = metadata;
			this.headings = this.name + "Headings";
			this.parentDiv = this.name + "Div";
			this.tds = this.name + "Tds";
			this.paginator = this.name + "Paginator";
			this.editDiv = this.name + "EditDiv";
			this.editModal = this.name + "EditModal";
			this.editModalBody = this.name + "EditModalBody";
			this.editEntity = this.name + "EditEntity";
			this.deleteEntity = this.name + "DeleteEntity";
			this.inputs = this.editEntity + "Inputs";
			this.editEntityCopy = this.name + "EditEntityCopy";
			this.form = this.editModal + "Form";
			this.searchTerms = this.name + "SearchTerms";
			this.deleteConfirmationDiv = entity + 'DeleteConfirmationDiv';
			this.deleteConfirmationModal = entity + 'DeleteConfirmationModal';
			this.editModalBuilt = false;
			this.singularEntity = this.getSingular(entity);
			this.apiWrapper = new apiWrapper($scope);
			this.apiWrapper.withResetOnNoneFound();
		    this.cols = 3;

			if (defaultPageSize !== null && defaultPageSize !== undefined && defaultPageSize !== 0 ){
				this.pageSize = defaultPageSize;
			}else{
				this.pageSize = 20;
			}
			
			if (!$scope[entity]){
				this
				    .apiWrapper
				    .configPagination(0,this.pageSize,this.singularEntity + "Id","desc")
				    .setEntityName(entity)
				    .fetchSortedPage();
			}
			this.buildDataTable();
			this.buildPaginator();
			this.buildEditModal();
			this.buildDeleteConfirmationModal();
		};
		
		apiDataTable.prototype.buildDataTable = function(){
			
			var that = this;
			var content =
				"<div class=\"row\">\n"+
				"<div class=\"col s12 m12 l12\">\n"+
				"<table class=\"bordered striped\" style='border:solid;border-color:grey;border-width:1px; margin-top:15px;'>\n"+
				"	<thead>\n"+
				"		<th ng-repeat=\"heading in "+this.headings+"\"\n"+
				"           ng-style=\"{width: "+this.name+".getWidth($index,heading)}\">\n"+
				"			{{heading.name}}\n"+
				"		</th>\n"+
				"	</thead>\n"+
				"	<tbody>\n"+
				"       <tr>\n"+
				"		    <td ng-repeat=\"heading in "+this.headings+"\">\n"+
                "			    <span ng-if=\"heading.content\" class=\"center-align\" bind-html-compile=\"heading.content\"></span>\n"+
                "		    </td>\n"+
                "       </tr>\n"+
				"		<tr ng-repeat=\""+this.singularEntity+" in "+this.entity+"\">\n"+
				"			<td><p ng-bind=\""+this.name+".getEntityId("+this.singularEntity+")\"></p></td>\n"+
				"			<td ng-repeat=\"td in "+this.tds+"\" bind-html-compile=\"td.content\">\n"+
				"			</td>\n"+
				"		</tr>\n"+
				"	</tbody>\n"+
				"</table>\n"+
				"</div>\n"+
				"</div>\n";
			
			this.$scope[this.parentDiv] = content;
			this.apiWrapper.getProfile(
					function(response){
						var descriptors = response.data.alps.descriptors;
						for (var i=0;i<descriptors.length;i++){
							if (descriptors[i].id == that.singularEntity + '-representation'){
								descriptors = descriptors[i].descriptors;
								break;
							}
						}
						that.$scope[that.headings] = [];
						that.$scope[that.searchTerms] = {};
						that.$scope[that.tds] = [];
						for (var prop in that.metadata){
							var descriptor = null;
							for (var j=0;j<descriptors.length;j++){
								if (descriptors[j].name == prop){
									if (that.metadata[descriptors[j].name] && that.metadata[descriptors[j].name].inGridVisible){
										descriptor = descriptors[j];
										break;
									}
								}
								
							}
							
							if (descriptor != null){
								var metadata = that.metadata[descriptor.name];
								var name = descriptor.name;
								var label = that.getLabel(name);
								
								that.$scope[that.headings].push(
								    {
								        id:name,
								        name:label,
								        metadata:metadata
                                    }
                                );
								that.$scope[that.tds].push({name:name});
								var cIndex = that.$scope[that.tds].length - 1;
								var obj = that.$scope[that.tds][cIndex];
								cIndex = that.$scope[that.headings].length - 1;
								var heading = that.$scope[that.headings][cIndex];
								
								if (metadata.iType == 'input'){
								    if (metadata.type && metadata.type == 'date'){
								        obj['content'] =
								            "<p ng-bind=\""+that.singularEntity+"[td.name] | date : 'MM/dd/yyyy'\"></p>\n";
								    }else if (metadata.type && metadata.type == 'binary'){
								        obj['content'] =
								            "<p ng-if=\""+that.singularEntity+"[td.name]\">\n"+
                                            "	<input\n"+
                                            "			id=\""+that.name+name+"{{$index}}\"\n"+
                                            "			type=\"checkbox\"\n"+
                                            "           ng-disabled='true'\n"+
                                            "			ng-model=\""+that.singularEntity+"[td.name]\">\n"+
                                            "	<label\n"+
                                            "			class=\"active\"\n"+
                                            "			for=\""+that.name+name+"{{$index}}\"></label>\n"+
                                            "</p>\n";
								    }
								    else{
								        obj['content'] =
                                            "<p ng-bind=\""+that.singularEntity+"[td.name]\"></p>\n";
								    }

									if (!that.$scope.bOptions)
										that.$scope.bOptions = [true,false];
									
									
									if (metadata.searchable){
										if (!metadata.type || metadata.type != 'binary'){
											heading['content'] =
												"<input id=\""+that.name+name+"Search\" \n"+
                                                "		type=\"text\" \n"+
                                                "		ng-model=\""+that.searchTerms+"."+name+"\" >\n";
										}
										
										if (metadata.type && metadata.type == 'binary'){
										    heading['content'] =
                                                "<input\n"+
                                                "		id=\""+that.name+"search"+name+"\"\n"+
                                                "		type=\"checkbox\"\n"+
                                                "		ng-model=\""+that.searchTerms+"."+name+"\">\n"+
                                                "<label\n"+
                                                "		class=\"active\"\n"+
                                                "		for=\""+that.name+"search"+name+"\"></label>\n";
										}
									}
									
									
								}
								
								if (metadata.iType == 'dropdown'){
								
									var singleEntity = that.getSingular(metadata.fetch);
									var entityList = metadata.fetch;
									var entitySingle = singleEntity;
									var entityName = singleEntity + "." + singleEntity + "Name";
									var entityId = singleEntity + "." + singleEntity + "Id";
									var restResource = singleEntity + "._links.self.href";
									
									obj['content'] = 
										"<p ng-bind=\""+that.singularEntity+"."+entityName+"\"></p>\n";
									
									if (metadata.searchable){
										heading['content'] =
											"<select class=\"applyMaterialSelect\" style='width:100px; padding:10px;'\n"+
                                            "	ng-options=\"" + restResource + " as " + entityName + " for " + entitySingle + " in " + entityList + "\"\n"+
                                            "	ng-model=\""+that.searchTerms+"."+name+"\">\n"+
                                            "</select>\n";
									}
									
									if (metadata.searchable || metadata.editable){
										if (!that.$scope[metadata.fetch])
											that.apiWrapper.fetchReferenceData(metadata.fetch);
									}
									
								}
								
								if (metadata.iType == 'searchable-dropdown'){
									
									var singleEntity = that.getSingular(metadata.fetch);
									var entityList = metadata.fetch;
									var entitySingle = singleEntity;
									var entityName = singleEntity + "." + singleEntity + "Name";
									var entityId = singleEntity + "." + singleEntity + "Id";
									var restResource = singleEntity + "._links.self.href";
									
									obj['content'] = 
										"<p ng-bind=\""+that.singularEntity+"."+entityName+"\"></p>\n";


									if (metadata.searchable){
									    var onHoverVar = that.name + "SearchBox" + name;
										heading['content'] =
										    "<div ng-mouseover=\""+onHoverVar+"=true;\"\n"+
										    "       ng-mouseleave=\""+onHoverVar+"=false;\">\n"+
											"<input type='text' \n"+
											"       ng-focus=\""+onHoverVar+"=true;\"\n"+
                                            "		ng-model=\""+that.searchTerms+"."+name+"."+singleEntity+"Name\"\n"+
                                            "		ng-change=\""+that.name+".getSearchSearchableData('"+name+"','"+singleEntity+"Name'"+",'"+metadata.fetch+"')\"\n"+
                                            "		autocomplete=\"off\">\n"+
                                            "<ul class=\"collection black-text\"\n"+
                                            "	style='max-height:200px;overflow: scroll;\n"+
                                            "	position:absolute;z-index: 1000;\n"+
                                            "	width:310px;max-width:310px;margin:0px'\n"+
                                            "	ng-show=\""+that.headings+"["+(cIndex+1)+"].showSearchedData && "+entityList+" && "+entityList+".length > 0 && "+onHoverVar+"\">\n"+
                                            "   <li class=\"collection-item\"\n"+
                                            "	ng-repeat=\""+singleEntity+" in "+entityList+"\"\n"+
                                            "	ng-bind=\""+entityName+"\"\n"+
                                            "	ng-click=\""+that.name+".setSearchSearchableData('"+name+"','"+singleEntity+"Name'"+",'"+metadata.fetch+"',"+singleEntity+")\"></li>\n"+
                                            "</ul>\n"+
                                            "</div>";
									}
									
									
								}
								
								if (metadata.iType == 'multiselect-dropdown'){ 
									
									var singleEntity = that.getSingular(name);
									var entityList = metadata.fetch;
									var entitySingle = singleEntity;
									var entityName = singleEntity + "." + singleEntity + "Name";
									var entityId = singleEntity + "." + singleEntity + "Id";
									var restResource = singleEntity + "._links.self.href";

									if (metadata.collectionType){
									    if (metadata.collectionType == 'list'){
                                        		obj['content'] =
                                                    "<ul class='collection' style='max-height:100px;overflow:auto'>" +
                                                    "   <li class='collection-item' "+
                                                    "       ng-repeat=\""+singleEntity+" in "+that.singularEntity+"."+name+" | orderBy : '"+singleEntity+"Name'\" ng-bind=\""+entityName+"\">" +
                                                    "   </li>"+
                                                    "</ul>";
                                        }
									}
									else{
									    obj['content'] =
                                            "<div class='chip blue white-text' " +
                                            "ng-repeat=\""+singleEntity+" in "+that.singularEntity+"."+name+" | orderBy : '"+singleEntity+"Name'\" ng-bind=\""+entityName+"\"></div>\n";
									}

									if (metadata.searchable){
										heading['content'] =
											"<select multiple class=\"applyMaterialSelect\" style='width:100px; padding:10px;'\n"+
                                            "		ng-options=\"" + restResource + " as " + entityName + " for " + entitySingle + " in " + entityList + "\"\n"+
                                            "		ng-model=\""+that.searchTerms+"."+name+"\">\n"+
                                            "       <option value='' disabled>Choose "+name+"</option>\n"+
                                            "</select>\n";
									}
									
									if (!that.$scope[metadata.fetch])
										that.apiWrapper.fetchReferenceData(metadata.fetch);
								}
							}
							
						}
						
						that.$scope[that.headings].push(
						    {
						        name:'Actions',
						        content:
						            "<a class=\"waves-effect waves-light btn green\"\n"+
						            "   style='width:100%;'\n"+
                                    "	ng-click=\""+that.name+".fetchSearchedData()\">\n"+
                                    "   Search\n"+
                                    "</a>\n"+
                                    "<a class=\"waves-effect waves-light btn green\"\n"+
                                    "   style='width:100%;'\n"+
                                    "	ng-click=\""+that.name+".fetchAllData()\">\n"+
                                    "   Reset\n"+
                                    "</a>\n"
                            }
                        );
						
						that.$scope[that.tds].push({name:'action'});
						var cIndex = that.$scope[that.tds].length - 1;
						var obj = that.$scope[that.tds][cIndex];
						
						obj['content'] =
							"<a class=\"waves-effect waves-light btn blue\"\n"+
							"   style='width:100%;'\n"+
							"	ng-click=\""+that.name+".openEditModal("+that.singularEntity+")\">\n"+
							"   Edit\n"+
							"</a>\n"+
							"<a class=\"waves-effect waves-light btn red\"\n"+
							"   style='width:100%;'\n"+
							"	ng-click=\""+that.name+".openDeleteConfirmationModal("+that.singularEntity+")\">\n"+
							"   Delete\n"+
							"</a>\n";
						
						that.$scope[that.headings].unshift(
						    {
						        name:"Id"
                            }
                        );  
						
						$timeout(function(){
							$('.dropdown-button').dropdown({
							      inDuration: 300,
							      outDuration: 225,
							      constrainWidth: false, // Does not change width of dropdown to that of the activator
							      hover: false, // Activate on hover
							      gutter:0, // Spacing from edge
							      belowOrigin: true, // Displays dropdown below the button
							      alignment: 'left', // Displays dropdown with edge aligned to the left of button
							      stopPropagation: false // Stops event propagation
							    }
							  );
							
							$('.dropdown-content').on('click',function(event){
								event.stopPropagation();
							})
						},1000)
						
					},
					function(error){
						console.log(error);
					});
		};

		apiDataTable.prototype.fetchSearchedData = function(){

            var searchTerms = this.$scope[this.searchTerms];
            var metadata = this.metadata;
            var searchParams = [];
            for (var prop in searchTerms){
                var mdata = metadata[prop];
                if (searchTerms[prop]){
                    switch(mdata.iType){
                        case 'input':
                            var searchParam = {};
                            if (searchTerms[prop] != ''){
                                searchParam[prop] = searchTerms[prop];
                                searchParams.push(searchParam);
                            }
                            break;
                        case 'dropdown':
                            var searchParam = {};
                            if (searchTerms[prop] != ''){
                                searchParam[prop] = this.getIdFromHref(searchTerms[prop]);
                                searchParams.push(searchParam);
                            }
                            break;
                        case 'searchable-dropdown':
                            var searchParam = {};
                            if (searchTerms[prop].id){
                                searchParam[prop] = searchTerms[prop].id;
                                searchParams.push(searchParam);
                            }
                            break;
                        case 'multiselect-dropdown':
                            var multipleSelections = searchTerms[prop];
                            for (var i=0;i<multipleSelections.length;i++){
                                var searchParam = {};
                                searchParam[prop] = this.getIdFromHref(multipleSelections[i]);
                                searchParams.push(searchParam);
                            }
                            break;
                    }
                }
            }

            if (searchParams.length > 0){
                this
                    .apiWrapper
                    .resetPage()
                    .resetSearchParams()
                    .resetSearchEntity()
                    .withSearchParams(searchParams)
                    .fetchSortedPage();
            }else{
                 this
                    .apiWrapper
                    .resetSearchParams()
                    .resetSearchEntity()
                    .resetPage()
                    .fetchSortedPage();
            }

		}

		apiDataTable.prototype.fetchAllData = function(){
		    this
                .apiWrapper
                .resetSearchParams()
                .resetSearchEntity()
                .resetPage()
                .fetchSortedPage();

            var searchTerms = this.$scope[this.searchTerms];
            for (var prop in searchTerms){
                searchTerms[prop] = null;
            }

		}

		
		apiDataTable.prototype.openEditModal = function(entity){
			
			var that = this;
			this.$scope[this.form].$setPristine();
			this.$scope[this.editEntity] = angular.copy(entity);
			
			var obj = this.$scope[this.editEntity];
            var baseUrl = window.location.host + '/api/';

			console.log(obj);

			for (var prop in this.metadata){
			    if (this.metadata[prop].type == 'date'){
			        obj[prop] = new Date(obj[prop]);
			    }
				if (typeof(obj[prop]) == 'object'){
					if (this.metadata[prop].iType == 'dropdown'){
						try{
						    obj[prop] = this.resolveHref(obj[prop],prop,this.metadata[prop]);
						}catch(err){
							console.log(err);
						}
					}
					if (this.metadata[prop].iType == 'searchable-dropdown'){
						try{
						    obj[prop].href = this.resolveHref(obj[prop],prop,this.metadata[prop]);
						}catch(err){
							console.log(err);
						}
					}
					if (this.metadata[prop].iType == 'multiselect-dropdown'){
						try{
						    var singularProp = this.getSingular(prop);
							var hrefs = [];
							for (var i=0;i<obj[prop].length;i++){
								var cObj = obj[prop][i];
								hrefs.push(this.resolveHref(cObj,singularProp,this.metadata[prop]));
							}
							obj[prop] = hrefs;
						}catch(err){
							console.log(err);
						}
					}
				}
			}

			console.log(this.$scope[this.editEntity]);
			this.$scope[this.editEntityCopy] = angular.copy(this.$scope[this.editEntity]);
			$('#'+this.editModal).modal('open');
			$timeout(function(){
				$('select').material_select();
			},200);
		};

		apiDataTable.prototype.buildPaginator = function(){
			var that = this;
			var content = 
				"<div class=\"row\"\n"+
				"	 ng-show=\""+this.name+".apiWrapper.totalPages > 1\">\n"+
				"	<div class=\"col s12 m12 l12\">\n"+
				"		<div class=\"container center-align\">\n"+
				"			<ul class=\"pagination\">\n"+
				"				<li class=\"waves-effect\"><i\n"+
				"					class=\"material-icons\" ng-click=\""+this.name+".apiWrapper.fetchPreviousPage()\">chevron_left</i></a></li>\n"+
				"					\n"+
				"				<li class=\"waves-effect\"><i\n"+
				"					class=\"material-icons\" ng-click=\""+this.name+".apiWrapper.firstPage()\">first_page</i></a></li>\n"+
				"				\n"+
				"				<li><label class=\"center-align\"\n"+
				"					style=\"margin: 0.1rem 0 1.0rem; width: 350px;\"\n"+
				"					>{{"+this.name+".apiWrapper.page + 1}} out of {{"+this.name+".apiWrapper.totalPages}}</label></li>\n"+
				"				\n"+
				"				<li class=\"waves-effect\"><i\n"+
				"					class=\"material-icons\" ng-click=\""+this.name+".apiWrapper.lastPage()\">last_page</i></a></li>	\n"+
				"				\n"+
				"				<li class=\"waves-effect\"><i\n"+
				"					class=\"material-icons\" ng-click=\""+this.name+".apiWrapper.fetchNextPage()\">chevron_right</i></a></li>\n"+
				"			</ul>\n"+
				"		</div>\n"+
				"	</div>\n"+
				"</div>\n";
			
			this.$scope[this.paginator] = content;
		}
		
		apiDataTable.prototype.openDeleteConfirmationModal = function(entity){
			var that = this;
			this.$scope[this.deleteEntity] = angular.copy(entity);
			$('#'+this.deleteConfirmationModal).modal('open');
		};
		
		apiDataTable.prototype.buildDeleteConfirmationModal = function(){
			
			var that = this;
			var content =
				"<div id=\""+this.deleteConfirmationModal+"\" class=\"modal\" style='margin-top:15%' >\n"+
				"	<div class=\"modal-content\" style=\"overflow:visible;\">\n"+
				"		<div class=\"window-table-div-border\">\n"+
				"			<h1>\n"+
				"				<span>Are you sure you want to delete this "+this.getLabel(this.singularEntity)+"</span>\n"+
				"			</h1>\n"+
				"			<div class='row'>\n" +
				"				<div class='col s12 m12 l6 right-align'>\n" +
				"					<a ng-click=\""+this.name+".deleteSelectedEntity()\" class='waves-effect waves-light btn'>Yes</a>\n" +
				"				</div>\n" +
				"				<div class='col s12 m12 l6 left-align'>\n" +
				"					<a class='waves-effect waves-light btn modal-close'>No</a>\n" +
				"				</div>\n" +
				"			</div>\n"+
				"			\n"+
				"		</div>\n"+
				"	</div>\n"+
				"</div>\n";
			
			this.$scope[this.deleteConfirmationDiv] = content;
			$timeout(function(){
				$('#'+that.deleteConfirmationModal).modal({
					dismissible : true,
					opacity : .5,
					in_duration : 300,
					out_duration : 200
				});
			},200);
		}
		
		apiDataTable.prototype.deleteSelectedEntity = function(){
			var that = this;
			if (this.$scope[this.deleteEntity]){
				this.apiWrapper.delete(
						this.$scope[this.deleteEntity],
						function(){
							that.update();
							$('#'+that.deleteConfirmationModal).modal('close');
						});
			}
		};
		
		apiDataTable.prototype.buildEditModal = function(){
			
			var that = this;
			var content =
				"<div id=\""+this.editModal+"\" class=\"modal\" style=\"max-height: 80%; width: 80%\" >\n"+
				"	<div class=\"modal-content\" style=\"overflow:visible;\">\n"+
				"		<div class=\"window-table-div-border\">\n"+
				"			<h1>\n"+
				"				<span>Edit "+this.getLabel(this.singularEntity)+"</span>\n"+
				"			</h1>\n"+
				"			<div bind-html-compile=\""+this.editModalBody+"\"></div>\n"+
				"			\n"+
				"		</div>\n"+
				"	</div>\n"+
				"</div>\n";
			
			this.$scope[this.editDiv] = content;
			$timeout(function(){
				$('#'+that.editModal).modal({
					dismissible : true,
					opacity : .5,
					in_duration : 300,
					out_duration : 200,
					starting_top : '4%',
					ending_top : '10%'
				});
			},200);
		
			
			var content = 
				"<form name=\""+this.form+"\" ng-submit=\""+this.name+".onSubmit()\">\n" +
					"<div class=\"row\"\n" +
						 "ng-repeat=\"row in "+this.name+".nRows()\">\n"+	
						 "<div class=\"col m12 s12 l4\"\n" +
						 	  "ng-repeat=\"col in "+this.name+".nCols()\" bind-html-compile=\""+this.inputs+"[row*3+col].content\">\n"+
						 "</div>\n"+
					"</div>\n"+
					"<div class=\"row\">\n"+
						"<div class=\"col s12 m6 l6 center-align\">\n"+
								"<input type=\"submit\" value=\"Update\"\n"+
								"class=\"btn\" ng-disabled=\"!(!"+this.form+".$invalid && !"+this.form+".$pristine)\">\n"+
						"</div>\n"+
						"<div class=\"col s12 m6 l6 center-align\">\n"+
							"<button type=\"button\" ng-click=\""+this.name+".resetForm()\" class=\"btn\"\n"+
								"ng-disabled=\""+this.form+".$pristine\">Reset</button>\n"+
						"</div>\n"+
					"</div>\n"+
				"</form>\n";

			this.$scope[this.editModalBody] = content;
			this.apiWrapper.getProfile(
					function(response){
					var descriptors = response.data.alps.descriptors;
					for (var i=0;i<descriptors.length;i++){
						if (descriptors[i].id == that.singularEntity + '-representation'){
							descriptors = descriptors[i].descriptors;
							break;
						}
					}
					that.$scope[that.inputs] = [];
					for (var prop in that.metadata){
						var descriptor = null;
						for (var j=0;j<descriptors.length;j++){
							if (descriptors[j].name == prop){
								if (that.metadata[descriptors[j].name] && that.metadata[descriptors[j].name].editable){
									descriptor = descriptors[j];
									break;
								}
							}

						}

						if (descriptor != null){
								var metadata = that.metadata[descriptor.name];
								var id = descriptor.name;
								var label = that.getLabel(id);

								that.$scope[that.inputs].push({id:id});
								var cIndex = that.$scope[that.inputs].length - 1;
								var obj = that.$scope[that.inputs][cIndex];

								if (metadata.type)obj['type']=metadata.type;
								if (metadata.required){
									obj['klass'] = 'validate';
									obj['required'] = true;
									obj['label'] = '*' + label;
								}else{
									obj['label'] = label;
								}

								if (metadata.iType == 'input'){
									if (metadata.type && metadata.type == 'binary'){
										if (!that.$scope.bOptions)
											that.$scope.bOptions = [true,false];
										obj['content'] =
											"<label class=\"active\"\n"+
													"for=\"{{"+that.inputs+"[row*3+col].id}}\"\n"+
													"ng-bind=\""+that.inputs+"[row*3+col].label\">\n"+
											"</label>\n"+
											"<select class=\"applyMaterialSelect\"\n"+
													"ng-class=\""+that.inputs+"[row*3+col].klass\"\n"+
													"ng-required=\""+that.inputs+"[row*3+col].required\"\n"+
													"ng-options=\"option for option in bOptions\"\n"+
													"ng-model=\""+that.editEntity+"["+that.inputs+"[row*3+col].id]\">\n"+
													"<option value='' disabled>Choose "+label+"</option>\n"+
											"</select>\n";

									}else{
										obj['content'] =
											"<label class=\"active\"\n"+
													"for=\"{{"+that.inputs+"[row*3+col].id}}\"\n"+
													"ng-bind=\""+that.inputs+"[row*3+col].label\">\n"+

											"</label>\n"+
											"<input	id=\"{{"+that.inputs+"[row*3+col].id}}\"\n"+
													"type=\"{{"+that.inputs+"[row*3+col].type ? "+that.inputs+"[row*3+col].type : 'text'}}\"\n"+
													"ng-model=\""+that.editEntity+"["+that.inputs+"[row*3+col].id]\"\n"+
													"ng-class=\""+that.inputs+"[row*3+col].klass\"\n"+
													"ng-required=\""+that.inputs+"[row*3+col].required\" />\n";
									}

								}
								if (metadata.iType == 'dropdown'){
									var singleEntity = that.getSingular(metadata.fetch);
									var entityList = metadata.fetch;
									var entitySingle = singleEntity;
									var entityName = singleEntity + "." + singleEntity + "Name";
									var entityId = singleEntity + "." + singleEntity + "Id";
									var restResource = singleEntity + "._links.self.href";

									obj['content'] =
										"<label class=\"active\"\n"+
												"for=\"{{"+that.inputs+"[row*3+col].id}}\"\n"+
												"ng-bind=\""+that.inputs+"[row*3+col].label\">\n"+
										"</label>\n"+
										"<select class=\"applyMaterialSelect\"\n"+
												"ng-class=\""+that.inputs+"[row*3+col].klass\"\n"+
												"ng-required=\""+that.inputs+"[row*3+col].required\"\n"+
												"ng-options=\"" + restResource + " as " + entityName + " for " + entitySingle + " in " + entityList + "\"\n"+
												"ng-model=\""+that.editEntity+"["+that.inputs+"[row*3+col].id]\">\n"+
												"<option value='' disabled>Choose "+label+"</option>\n"+
										"</select>\n";

									if (!that.$scope[metadata.fetch]){
										that.apiWrapper.fetchReferenceData(metadata.fetch);
									}
								}

								if (metadata.iType == 'searchable-dropdown'){
									var singleEntity = that.getSingular(metadata.fetch);
									var entityList = metadata.fetch;
									var entitySingle = singleEntity;
									var entityName = singleEntity + "." + singleEntity + "Name";
									var entityId = singleEntity + "." + singleEntity + "Id";
									var restResource = singleEntity + "._links.self.href";

									obj['content'] =
										"<label class=\"active\"\n"+
										"		for=\"{{"+that.inputs+"[row*3+col].id}}\"\n"+
										"		ng-bind=\""+that.inputs+"[row*3+col].label\">\n"+
										"</label>\n"+
										"<input id=\"{{"+that.inputs+"[row*3+col].id}}\" \n"+
										"		ng-class=\""+that.inputs+"[row*3+col].klass\"\n"+
										"		ng-required=\""+that.inputs+"[row*3+col].required\"\n"+
										"		placeholder='Choose "+label+"'\n"+
										"		type='text' \n"+
										"		ng-model=\""+that.editEntity+"["+that.inputs+"[row*3+col].id]."+singleEntity+"Name"+"\"\n"+
										"		ng-change=\""+that.name+".getSearchableData("+that.inputs+"[row*3+col].id"+",'"+singleEntity+"Name'"+",'"+metadata.fetch+"')\"\n"+
										"		ng-blur=\""+that.name+".setSearchableData("+that.inputs+"[row*3+col].id"+",'"+singleEntity+"Name'"+",'"+metadata.fetch+"')\"\n"+
										"		autocomplete=\"off\"\n"+
										"		required\n"+
										"		>\n"+

										"<ul class=\"collection black-text\"\n"+
										"	style='max-height:200px;overflow: scroll;\n"+
										"			position:absolute;z-index: 1000;\n"+
										"			width:310px;max-width:310px;margin:0px'\n"+
										"	ng-show=\""+that.inputs+"[row*3+col].showSearchedData && "+entityList+" && "+entityList+".length > 0\">\n"+
										"	\n"+
										"	<li class=\"collection-item\"\n"+
										"		ng-repeat=\""+singleEntity+" in "+entityList+"\"\n"+
										"		ng-bind=\""+entityName+"\"\n"+
										"		ng-click=\""+that.name+".setSearchableData("+that.inputs+"[row*3+col].id"+",'"+singleEntity+"Name'"+",'"+metadata.fetch+"',"+singleEntity+")\"></li>\n"+
										"</ul>\n";
								}

								if (metadata.iType == 'multiselect-dropdown'){

									var singleEntity = that.getSingular(metadata.fetch);
									var entityList = metadata.fetch;
									var entitySingle = singleEntity;
									var entityName = singleEntity + "." + singleEntity + "Name";
									var entityId = singleEntity + "." + singleEntity + "Id";
									var restResource = singleEntity + "._links.self.href";

									obj['content'] =
										"<label class=\"active\"\n"+
												"for=\"{{"+that.inputs+"[row*3+col].id}}\"\n"+
												"ng-bind=\""+that.inputs+"[row*3+col].label\">\n"+
										"</label>\n"+
										"<select class=\"applyMaterialSelect\" multiple\n"+
												"ng-class=\""+that.inputs+"[row*3+col].klass\"\n"+
												"ng-required=\""+that.inputs+"[row*3+col].required\"\n"+
												"ng-options=\"" + restResource + " as " + entityName + " for " + entitySingle + " in " + entityList + "\"\n"+
												"ng-model=\""+that.editEntity+"["+that.inputs+"[row*3+col].id]\">\n"+
												"<option value='' disabled>Choose "+label+"</option>\n"+
										"</select>\n";
										
									if (!that.$scope[metadata.fetch]){
										that.apiWrapper.fetchReferenceData(metadata.fetch);
									}
										
								}
							}
							
						}
						
						that.rows = [];
						that.rows = that.$scope[that.inputs].length / that.cols;
					},
					function(error){
						console.log(error);
					});
			
			this.editModalBuilt = true;
		}
		
		apiDataTable.prototype.getSearchableData = function(prop,searchable,entity){
			
			var that = this;
			if (!this.$scope[this.editEntity][prop][searchable]){
				for (var i=0;i<that.$scope[that.inputs].length;i++){
					if (that.$scope[that.inputs][i].id == prop){
						that.$scope[that.inputs][i].showSearchedData = false;
					}
				}
				return;
			}
			else{
				var api = new apiWrapper(this.$scope);
				api
				    .configPagination(0,100)
				    .setSearchParams(searchable,this.$scope[this.editEntity][prop][searchable])
				    .setEntityName(entity)
				    .fetchSortedPage(
				        function(response){
					    for (var i=0;i<that.$scope[that.inputs].length;i++){
						    if (that.$scope[that.inputs][i].id == prop){
						    	that.$scope[that.inputs][i].showSearchedData = true;
						    }
					    }
				    }
                );
			}
		}
		apiDataTable.prototype.setSearchableData = function(prop,searchable,entity,obj){
			
			var that = this;
			if (obj){
				this.$scope[this.editEntity][prop].href=this.resolveHref(obj,prop,{fetch:entity});
				this.$scope[this.editEntity][prop][searchable] = obj[searchable];
				for (var i=0;i<that.$scope[that.inputs].length;i++){
					if (that.$scope[that.inputs][i].id == prop){
						$timeout(function(){
							that.$scope[that.inputs][i].showSearchedData = false;
						},500);
						break;
					}
				}
				return;
			}
			if (!this.$scope[this.editEntity][prop][searchable]){
				for (var i=0;i<that.$scope[that.inputs].length;i++){
					if (that.$scope[that.inputs][i].id == prop){
						$timeout(function(){
							that.$scope[that.inputs][i].showSearchedData = false;
						},500);
						break;
					}
				}
				this.$scope[this.editEntity][prop].href=null;
				return;
			}
			else{
				if (this.$scope[entity]){
					var lst = this.$scope[entity];
					var matchFound = false;
					for (var i=0;i<lst.length;i++){
						if (this.$scope[this.editEntity][prop][searchable] == lst[i][searchable]){
							this.$scope[this.editEntity][prop].href = this.resolveHref(lst[i],prop,{fetch:entity});
							matchFound = true;
							break;
						}
					}
					if (!matchFound)
						this.$scope[this.editEntity][prop].href=null;
				}else{
					this.$scope[this.editEntity][prop].href=null;
				}
			}
			
			for (var i=0;i<that.$scope[that.inputs].length;i++){
				if (that.$scope[that.inputs][i].id == prop){
					$timeout(function(){
						that.$scope[that.inputs][i].showSearchedData = false;
					},500);
					break;
				}
			}
		}
		
		apiDataTable.prototype.getSearchSearchableData = function(prop,searchable,entity){
			
			var that = this;
			var searchText = this.$scope[this.searchTerms][prop][searchable];
			var searchTerms = this.$scope[this.searchTerms];
			var headings = this.$scope[that.headings];

			if (!searchText || searchText == ''){
				for (var i=0;i<headings.length;i++){
					if (headings[i].id == prop){
					    searchTerms[prop].id = null;
						headings[i].showSearchedData = false;
					}
				}
				return;
			}
			else{
				var api = new apiWrapper(this.$scope);
				api
				    .configPagination(0,100)
				    .setSearchParams(searchable,this.$scope[this.searchTerms][prop][searchable])
				    .setEntityName(entity)
				    .fetchSortedPage(
				    function(response){
					    for (var i=0;i<that.$scope[that.headings].length;i++){
						    if (that.$scope[that.headings][i].id == prop){
							    that.$scope[that.headings][i].showSearchedData = true;
						    }
					    }
				    }
                );
			}
		}
		apiDataTable.prototype.setSearchSearchableData = function(prop,searchable,entity,obj){
			
			var that = this;
			var searchTerms = this.$scope[this.searchTerms];
			var headings = this.$scope[this.headings];
			if (obj){
				searchTerms[prop].id = this.getEntityId(obj);
				searchTerms[prop][searchable] = obj[searchable];
				for (var i=0;i<headings.length;i++){
                    if (headings[i].id == prop){
                        $timeout(function(){
                            headings[i].showSearchedData = false;
                        },500);
                        break;
                    }
                }
				return;
			}
		}
		apiDataTable.prototype.getLabel = function (camelCase) {
			  return camelCase	
			    .replace(/([A-Z])/g, function(match) {
			       return " " + match;
			    })
			    .replace(/^./, function(match) {
			      return match.toUpperCase();
			    });
		};

        apiDataTable.prototype.resolveHref = function(obj,prop, metadata){
            var href = null;
            if (obj[prop + 'Id']){
               var href =
                    window.location.protocol +
                    "//"+
                    window.location.host +
                    '/api/' +
                    metadata.fetch +
                     '/' +
                     obj[prop + 'Id'];
            }else if (obj._links){
                var href = obj._links.self.href;
                var bIndex = href.indexOf("{");
                href = href.substring(0,bIndex);
            }

            if (href == null)
                throw 'href cannot be constructed';
            else{
                href = this.sanitizeHref(href);
                return href;
            }

        };

        apiDataTable.prototype.sanitizeHref = function(href){
            var bIndex = href.indexOf("{");
            if (bIndex > 0)
                href = href.substring(0,bIndex);
            return href;
        }
        apiDataTable.prototype.getIdFromHref = function(href){
            var bIndex = href.indexOf("{");
            if (bIndex > 0)
                href = href.substring(0,bIndex);

            bIndex = href.lastIndexOf("/");
            if (bIndex > 0)
                href = href.substring(bIndex+1,href.length);

            return href;
        };

		apiDataTable.prototype.getJSON = function(str){
			
			var str = 
				str
				.replace(/[{]/g,function(match){
					return match + "\"";
				})
				.replace(/[}]/g,function(match){
					return "\"" + match;
				})
				.replace(/[:]/g,function(match){
					return "\"" + match + "\"";
				})
				.replace(/[,]/g,function(match){
					return "\"" + match + "\"";
				});
			
			return JSON.parse(str);
		};
		
		apiDataTable.prototype.getSingular = function (entity){
            if (entity === 'movies')
                return 'movie';
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
		
		apiDataTable.prototype.nRows = function(){
			var rows = [];
			for (var i=0;i<this.rows;i++)
				rows.push(i);
			return rows;
		}
		apiDataTable.prototype.nCols = function(){
			var cols = [];
            for (var i=0;i<this.cols;i++)
                cols.push(i)
            return cols;
		}
		apiDataTable.prototype.toast = function(msg){
			Materialize.toast(msg, 2500,'blue rounded');
		}
		apiDataTable.prototype.getEntityId = function(entity){
			var href = entity._links.self.href;
			var bIndex = href.indexOf("{");
			if (bIndex > 0)
				href = href.substring(0,bIndex);
			
			bIndex = href.lastIndexOf("/");
			if (bIndex > 0)
				href = href.substring(bIndex+1,href.length);
			
			return href;
		}
		apiDataTable.prototype.onSubmit = function(){
			this.$scope[this.form].$setPristine();
			var that = this;
			
			var editEntity = this.$scope[this.editEntity];
			for (var prop in this.metadata){
				if (this.metadata[prop].iType == 'searchable-dropdown' && this.metadata[prop].required){
					if (!editEntity[prop].href){
						this.toast(this.getLabel(prop) + " must have valid value");
						return;
					}
				}
			}
			
			for (var prop in this.metadata){
				if (this.metadata[prop].iType == 'searchable-dropdown'){
					editEntity[prop] = editEntity[prop].href;
				}
			}
			this.apiWrapper.update(
					this.$scope[this.editEntity],
					that.$scope,
					function(response){
						that.toast("Updated");
						$('#' + that.editModal).modal('close');
						that.apiWrapper.fetchSortedPage();
					},
					function(error){
						that.toast(error.statusText);
					});
		};

		apiDataTable.prototype.resetForm = function(){
			this.$scope[this.form].$setPristine();
			this.$scope[this.editEntity] = angular.copy(this.$scope[this.editEntityCopy]);
		}
		apiDataTable.prototype.update = function(){
			this.apiWrapper.fetchSortedPage();
		}

		apiDataTable.prototype.getWidth = function(index,heading){
		    var headings = this.$scope[this.headings];
		    var heading = headings[index];

		    if (index == headings.length - 1)
		        return '10%';
            if (index == 0)
                return '5%';
            if (heading.metadata.type && heading.metadata.type == 'binary')
                return '10%';

            return 'auto';
		}
		return apiDataTable;
	}]);
}(window.angular));
