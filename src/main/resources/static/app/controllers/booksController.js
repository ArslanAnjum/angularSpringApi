'use strict';

/**
 * @author ArslanAnjum
 */
app.controller('booksController',
		['$scope','apiControllerTemplate',
			function($scope,apiControllerTemplate){
			
			$scope.init = function(csrfParamName, csrfToken, csrfHeaderName,server,entity){
				var dataTableMetadata = 
				{
					bookName 		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
					description		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
					person          :{iType:'dropdown',fetch:'persons',editable:true,inGridVisible:true},
					available		:{iType:'input', type:'binary', required:true,editable:true,searchable:true,inGridVisible:true}
				};
			
				var createFormMetadata = 
					{
						bookName 		:{iType:'input',required:true},
                        description		:{iType:'input',required:true},
                        person          :{iType:'dropdown',fetch:'persons'},
                        available		:{iType:'input', type:'binary', required:true}
					};
				
				apiControllerTemplate
				.buildControllerTemplate(
						csrfParamName,
						csrfToken,
						csrfHeaderName,
						server,
						entity,
						$scope,
						dataTableMetadata,
						createFormMetadata
				);
			}
		}]);