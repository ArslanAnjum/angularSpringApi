(function(angular){
	'use strict';

	/**
	 * @Description 
	 * 
	 * must contain notCreatable:true for those items that cannot be created directly
	 * specify fetch:entityName for associations which are already present in db
	 * specify type:text,number,email etc.
	 * set required:true which must be present
	 * 
	 * 
	 */
	
	var apiFormModule = angular.module('apiForm',[]);
	apiFormModule.service('apiForm',['apiWrapper','$timeout',function(apiWrapper,$timeout){
		
		var $scope;
		var name;
		var entity;
		var	singularEntity;
		var apiWrapper;
		var parentDiv;
		var form;
		var inputs;
		var newObj;
		var rows;
		var cols;
		var metadata;
		var onCreate;
		
		var apiForm = function($scope,entity,metadata,onCreate){
			this.$scope = $scope;
			this.name = entity+'Create';
			this.entity = entity;
			this.apiWrapper = new apiWrapper($scope);
			this.parentDiv = this.name + "Div";
			this.form = this.name + "Form";
			this.inputs = this.name + "Inputs";
			this.newObj = this.name + "NewObj";
			$scope[this.newObj] = {};
			this.singularEntity = this.getSingular(this.entity);
			this.metadata = metadata;
			this.onCreate = onCreate;
			this.cols = 3;
			this.buildForm();
		};
		
		apiForm.prototype.buildForm = function(){
			
			var that = this;
			var content =
				"<div class=\"row\">\n"+
				"	<div class=\"col s12 m12 l12 right-align\">\n"+
				"		<a class=\"waves-effect waves-light btn blue\"\n"+
				"			ng-click=\""+this.name+".openAddModal()\"> <i class=\"material-icons left\">add</i>Add\n"+
				"			New\n"+
				"		</a>\n"+
				"	</div>\n"+
				"</div>\n"+
				"<div id=\""+this.name+"ModalAdd\" class=\"modal\" style=\"max-height: 80%;width: 80%\" >\n"+
				"	<div class=\"modal-content\" style=\"overflow:visible;\">\n"+
				"		<div class=\"window-table-div-border\">\n"+
				"			<h1>\n"+
				"				<span>Add New "+this.getLabel(this.singularEntity)+"</span>\n"+
				"			</h1>\n"+
				"			<form name=\""+this.form+"\" ng-submit=\""+this.name+".onSubmit()\">\n" +
				"				<div class=\"row\"\n" +
				"					ng-repeat=\"row in "+this.name+".nRows()\">\n"+	
				"					<div class=\"col m12 s12 l4\"\n" +
				"						ng-repeat=\"col in "+this.name+".nCols()\" bind-html-compile=\""+this.inputs+"[row*2+col].content\">\n"+
				"					</div>\n"+
				"				</div>\n"+
				"				<div class=\"row\">\n"+
				"					<div class=\"col s12 m6 l6 center-align\">\n"+
				"						<input type=\"submit\"\n"+ 
				"								class=\"btn\" ng-disabled=\""+this.form+".$invalid\">\n"+
				"					</div>\n"+
				"					<div class=\"col s12 m6 l6 center-align\">\n"+
				"						<button type=\"button\" ng-click=\""+this.name+".resetForm()\" class=\"btn\"\n"+
				"							ng-disabled=\""+this.form+".$pristine\">Reset</button>\n"+
				"					</div>\n"+
				"				</div>\n"+
				"			</form>\n"
				"		</div>\n"+
				"	</div>\n"+
				"</div>\n";
		
			this.$scope[this.parentDiv] = content;
			this.apiWrapper.getProfile(
					this.
					entity,
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
								if (descriptors[j].name == prop && that.metadata[descriptors[j].name]){
									descriptor = descriptors[j];
									break;
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
													"for=\"{{"+that.inputs+"[row*2+col].id}}\"\n"+
													"ng-bind=\""+that.inputs+"[row*2+col].label\">\n"+
											"</label>\n"+
											"<select class=\"applyMaterialSelect\"\n"+
													"ng-class=\""+that.inputs+"[row*2+col].klass\"\n"+ 
													"ng-required=\""+that.inputs+"[row*2+col].required\"\n"+
													"ng-options=\"option for option in bOptions\"\n"+
													"ng-model=\""+that.newObj+"["+that.inputs+"[row*2+col].id]\">\n"+
													"<option value='' disabled>Choose "+label+"</option>\n"+
											"</select>\n";
																				
									}else{
										obj['content'] = 
											"<label class=\"active\"\n"+ 
													"for=\"{{"+that.inputs+"[row*2+col].id}}\"\n"+
													"ng-bind=\""+that.inputs+"[row*2+col].label\">\n"+
													
											"</label>\n"+
											"<input	id=\"{{"+that.inputs+"[row*2+col].id}}\"\n"+ 
													"type=\"{{"+that.inputs+"[row*2+col].type ? "+that.inputs+"[row*2+col].type : 'text'}}\"\n"+ 
													"ng-model=\""+that.newObj+"["+that.inputs+"[row*2+col].id]\"\n"+
													"ng-class=\""+that.inputs+"[row*2+col].klass\"\n"+ 
													"ng-required=\""+that.inputs+"[row*2+col].required\" />\n";
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
												"for=\"{{"+that.inputs+"[row*2+col].id}}\"\n"+
												"ng-bind=\""+that.inputs+"[row*2+col].label\">\n"+
										"</label>\n"+
										"<select class=\"applyMaterialSelect\"\n"+
												"ng-class=\""+that.inputs+"[row*2+col].klass\"\n"+ 
												"ng-required=\""+that.inputs+"[row*2+col].required\"\n"+
												"ng-options=\"" + restResource + " as " + entityName + " for " + entitySingle + " in " + entityList + "\"\n"+
												"ng-model=\""+that.newObj+"["+that.inputs+"[row*2+col].id]\">\n"+
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
										"		for=\"{{"+that.inputs+"[row*2+col].id}}\"\n"+
										"		ng-bind=\""+that.inputs+"[row*2+col].label\">\n"+
										"</label>\n"+
										"<input id=\"{{"+that.inputs+"[row*2+col].id}}\" \n"+
										"		ng-class=\""+that.inputs+"[row*2+col].klass\"\n"+ 
										"		ng-required=\""+that.inputs+"[row*2+col].required\"\n"+
										"		placeholder='Choose "+label+"'\n"+
										"		type='text' \n"+
										"		ng-model=\""+that.newObj+"["+that.inputs+"[row*2+col].id]."+singleEntity+"Name"+"\"\n"+
										"		ng-change=\""+that.name+".getSearchableData("+that.inputs+"[row*2+col].id"+",'"+singleEntity+"Name'"+",'"+metadata.fetch+"')\"\n"+
										"		ng-blur=\""+that.name+".setSearchableData("+that.inputs+"[row*2+col].id"+",'"+singleEntity+"Name'"+",'"+metadata.fetch+"')\"\n"+
										"		autocomplete=\"off\"\n"+
										"		required\n"+
										"		>\n"+
										
										"<ul class=\"collection black-text\"\n"+
										"	style='max-height:200px;overflow: scroll;\n"+
										"			position:absolute;z-index: 1000;\n"+
										"			width:310px;max-width:310px;margin:0px'\n"+
										"	ng-show=\""+that.inputs+"[row*2+col].showSearchedData && "+entityList+" && "+entityList+".length > 0\">\n"+
										"	\n"+
										"	<li class=\"collection-item\"\n"+
										"		ng-repeat=\""+singleEntity+" in "+entityList+"\"\n"+
										"		ng-bind=\""+entityName+"\"\n"+
										"		ng-click=\""+that.name+".setSearchableData("+that.inputs+"[row*2+col].id"+",'"+singleEntity+"Name'"+",'"+metadata.fetch+"',"+singleEntity+")\"></li>\n"+
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
												"for=\"{{"+that.inputs+"[row*2+col].id}}\"\n"+
												"ng-bind=\""+that.inputs+"[row*2+col].label\">\n"+
										"</label>\n"+
										"<select class=\"applyMaterialSelect\" multiple\n"+
												"ng-class=\""+that.inputs+"[row*2+col].klass\"\n"+ 
												"ng-required=\""+that.inputs+"[row*2+col].required\"\n"+
												"ng-options=\"" + restResource + " as " + entityName + " for " + entitySingle + " in " + entityList + "\"\n"+
												"ng-model=\""+that.newObj+"["+that.inputs+"[row*2+col].id]\">\n"+
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
						
						$timeout(function(){
							$('#'+that.name+"ModalAdd").modal({
								dismissible : true,
								opacity : .5,
								in_duration : 300,
								out_duration : 200,
								starting_top : '4%',
								ending_top : '10%'
							});
						},200);
					},
					function(error){
						console.log(error);
					});
		};
		apiForm.prototype.getSearchableData = function(prop,searchable,entity){
			
			var that = this;
			if (!this.$scope[this.newObj][prop][searchable]){
				
				for (var i=0;i<that.$scope[that.inputs].length;i++){
					if (that.$scope[that.inputs][i].id == prop){
						that.$scope[that.inputs][i].showSearchedData = false;
					}
				}
				return;
			}
			else{
				var apiSearchable = new apiWrapper(this.$scope);
				apiSearchable.configPagination(0,100);
				apiSearchable.setSearchEntity(this.getFindByString(searchable));
				apiSearchable.setSearchParams(searchable,this.$scope[this.newObj][prop][searchable]);
				apiSearchable.fetchSortedPage(entity,function(){
					for (var i=0;i<that.$scope[that.inputs].length;i++){
						if (that.$scope[that.inputs][i].id == prop){
							that.$scope[that.inputs][i].showSearchedData = true;
						}
					}
				});
			}
		}
		apiForm.prototype.setSearchableData = function(prop,searchable,entity,obj){
			
			var that = this;
			if (obj){
				/*this.$scope[this.newObj][prop].href=obj._links.self.href;*/
				this.$scope[this.newObj][prop].href=this.resolveHref(obj,prop,{fetch:entity});
				this.$scope[this.newObj][prop][searchable] = obj[searchable];
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
			if (!this.$scope[this.newObj][prop][searchable]){
				for (var i=0;i<that.$scope[that.inputs].length;i++){
					if (that.$scope[that.inputs][i].id == prop){
						$timeout(function(){
							that.$scope[that.inputs][i].showSearchedData = false;
						},500);
						break;
					}
				}
				this.$scope[this.newObj][prop].href=null;
				return;
			}
			else{
				if (this.$scope[entity]){
					var lst = this.$scope[entity];
					var matchFound = false;
					for (var i=0;i<lst.length;i++){
						if (this.$scope[this.newObj][prop][searchable] == lst[i][searchable]){
							//this.$scope[this.newObj][prop].href = lst[i]._links.self.href;
							this.$scope[this.newObj][prop].href = this.resolveHref(lst[i],prop,{fetch:entity});
							matchFound = true;
							break;
						}
					}
					if (!matchFound)
						this.$scope[this.newObj][prop].href=null;
				}else{
					this.$scope[this.newObj][prop].href=null;
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
		apiForm.prototype.getFindByString = function (str) {
			  str = 
				  str
			    .replace(/^./, function(match) {
			      return match.toUpperCase();
			    });
			  
			  return "findBy" + str;
		};
		apiForm.prototype.openAddModal = function(){
			$('#'+this.name+"ModalAdd").modal('open');
		}
		apiForm.prototype.getLabel = function (camelCase) {
			  return camelCase
			    .replace(/([A-Z])/g, function(match) {
			       return " " + match;
			    })
			    .replace(/^./, function(match) {
			      return match.toUpperCase();
			    });
		};
		
		apiForm.prototype.getJSON = function(str){
			
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

		apiForm.prototype.resolveHref = function(obj,prop, metadata){
            var href = null;
            if (obj[prop + 'Id']){
               var href =
                    'http://' +
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

        apiForm.prototype.sanitizeHref = function(href){
            var bIndex = href.indexOf("{");
            if (bIndex > 0)
                href = href.substring(0,bIndex);
            return href;
        }
        apiForm.prototype.getIdFromHref = function(href){
            var bIndex = href.indexOf("{");
            if (bIndex > 0)
                href = href.substring(0,bIndex);

            bIndex = href.lastIndexOf("/");
            if (bIndex > 0)
                href = href.substring(bIndex+1,href.length);

            return href;
        };
		apiForm.prototype.getSingular = function (entity){
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
		
		apiForm.prototype.toast = function(msg){
			Materialize.toast(msg, 2500,'blue rounded');
		}
		
		apiForm.prototype.nRows = function(){
			var rows = [];
			for (var i=0;i<this.rows;i++)
				rows.push(i);
			return rows;
		}
		apiForm.prototype.nCols = function(){
		    var cols = [];
		    for (var i=0;i<this.cols;i++)
			    cols.push(i)
			return cols;
		}
		
		apiForm.prototype.onSubmit = function(){
			this.$scope[this.form].$setPristine();
			var that = this;
		
			var newObj = this.$scope[this.newObj];
			for (var prop in this.metadata){
				if (this.metadata[prop].iType == 'searchable-dropdown' && this.metadata[prop].required){
					if (!newObj[prop].href){
						this.toast(this.getLabel(prop) + " must have valid value");
						return;
					}
				}
			}
			
			for (var prop in this.metadata){
				if (this.metadata[prop].iType == 'searchable-dropdown'){
					newObj[prop] = newObj[prop].href;
				}
			}
			
			this.apiWrapper.create(this.entity,this.$scope[this.newObj],this.$scope,
					function(response){
						that.toast("Created");
						for (var prop in that.$scope[that.newObj])
							that.$scope[that.newObj][prop] = null;
						that.onCreate();
						$('#'+that.name+"ModalAdd").modal('close');;
					},
					function(error){
						that.toast(error);
					});
		};
		apiForm.prototype.resetForm = function(){
			this.$scope[this.form].$setPristine();
			for (var prop in this.$scope[this.newObj])
				this.$scope[this.newObj][prop] = null;
		}
		return apiForm;
	}]);
}(window.angular));
