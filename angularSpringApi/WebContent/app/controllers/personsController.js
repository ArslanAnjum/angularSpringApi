'use strict';

/**
 * @author ArslanAnjum
 */
app.controller('personsController',
		['$scope','apiForm','apiDataTable',
			function($scope,apiForm,apiDataTable){
			
			$scope.init = function(csrfParamName, csrfToken, csrfHeaderName,server,entity){
				$scope.csrfParamName = csrfParamName;
				$scope.csrfToken = csrfToken;
				$scope.csrfHeaderName = csrfHeaderName;
				$scope.server = server;
				var dataTable = entity + 'DataTable';
				var createForm = entity + 'Create';
				
				
				var dataTableMetadata = 
					{
						name 		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
						address		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
						emailId 	:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
						phoneNumber :{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
						city		:{iType:'searchable-dropdown',fetch:'cities',required:true,editable:true,searchable:true,inGridVisible:true},
						industry	:{iType:'searchable-dropdown',fetch:'industries',required:true,editable:true,searchable:true,inGridVisible:true},
						badges		:{iType:'multiselect-dropdown',fetch:'badges',editable:true,searchable:true,inGridVisible:true}
					};
				
				var createFormMetadata = 
					{
						name 		:{iType:'input',required:true},
						address		:{iType:'input',required:true},
						emailId 	:{iType:'input',type:'email',required:true},
						phoneNumber :{iType:'input',required:true},
						city		:{iType:'searchable-dropdown',fetch:'cities',required:true},
						industry	:{iType:'searchable-dropdown',fetch:'industries',required:true},
						badges		:{iType:'multiselect-dropdown',fetch:'badges'}
					};
				
				
				
				$scope[dataTable] = new apiDataTable(
						$scope,
						entity,
						dataTableMetadata
				);
				$scope[createForm] = new apiForm(
						$scope,
						entity,
						createFormMetadata,
						function(){
							$scope[dataTable].update();
						}
				);
			}
		}]);