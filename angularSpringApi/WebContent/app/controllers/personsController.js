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
				
				$scope[entity+'DataTable'] = new apiDataTable(
						$scope,
						entity+'DataTable',
						"persons",
						{
							name 		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
							address		:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
							emailId 	:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
							phoneNumber :{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
							city		:{iType:'searchable-dropdown',fetch:'cities',required:true,editable:true,searchable:true,inGridVisible:true},
							industry	:{iType:'searchable-dropdown',fetch:'industries',required:true,editable:true,searchable:true,inGridVisible:true},
							badges		:{iType:'multiselect-dropdown',fetch:'badges',editable:true,searchable:true,inGridVisible:true}
						}
				);
				
				$scope[entity+'Create'] = new apiForm(
						$scope,
						entity+'Create',
						"persons",
						{
							name 		:{iType:'input',required:true},
							address		:{iType:'input',required:true},
							emailId 	:{iType:'input',type:'email',required:true},
							phoneNumber :{iType:'input',required:true},
							city		:{iType:'searchable-dropdown',fetch:'cities',required:true},
							industry	:{iType:'searchable-dropdown',fetch:'industries',required:true},
							badges		:{iType:'multiselect-dropdown',fetch:'badges'}
						},
						function(){
							$scope[entity+'DataTable'].update();
						}
				);
			}
		}]);