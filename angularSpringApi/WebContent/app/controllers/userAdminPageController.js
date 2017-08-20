'use strict';

/**
 * @author ArslanAnjum
 */
app.controller('userAdminPageController',
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
						"appUsers",
						{
							firstName 	:{iType:'input',required:true,editable:true,searchable:true,inGridVisible:true},
							lastName 	:{iType:'input',required:true,editable:true,searchable:true},
							username	:{iType:'input',required:true,searchable:true,inGridVisible:true},
							authorities	:{iType:'multiselect-dropdown',fetch:'authorities',inGridVisible:true,editable:true,searchable:true},
							password	:{iType:'input',required:true,editable:true},
							emailId		:{iType:'input',type:'email',required:true,searchable:true,inGridVisible:true},
							companyName	:{iType:'input',editable:true,searchable:true,inGridVisible:true},
							phoneNumber	:{iType:'input',required:true,editable:true},
							city		:{iType:'searchable-dropdown',fetch:'cities',required:true,editable:true,searchable:true,inGridVisible:true},
							industry	:{iType:'searchable-dropdown',fetch:'industries',required:true,editable:true,searchable:true,inGridVisible:true},
							screen		:{iType:'dropdown',fetch:'screens',editable:true,searchable:true}
						}
				);
				
				$scope[entity+'Create'] = new apiForm(
						$scope,
						entity+'Create',
						"appUsers",
						{
							firstName 	:{iType:'input',required:true},
							lastName 	:{iType:'input',required:true},
							username	:{iType:'input',required:true},
							password	:{iType:'input',required:true},
							emailId		:{iType:'input',type:'email',required:true},
							authorities	:{iType:'multiselect-dropdown',fetch:'authorities',required:true},
							companyName	:{iType:'input'},
							phoneNumber	:{iType:'input',required:true},
							city		:{iType:'searchable-dropdown',required:true,fetch:'cities'},
							industry	:{iType:'searchable-dropdown',required:true,fetch:'industries'},
							screen		:{iType:'dropdown',fetch:'screens'}
						},
						function(){
							$scope[entity+'DataTable'].update();
						}
				);
			}
		}]);