(function(angular){
	'use strict';
	
	var apiControllerModule = angular.module('apiControllerTemplate',[]);
	
	apiControllerModule.service('apiControllerTemplate',['apiForm','apiDataTable',
		function(apiForm,apiDataTable){
			
			this.buildControllerTemplate = function(
					csrfParamName,
					csrfToken,
					csrfHeaderName,
					server,
					entity,
					$scope,
					dataTableMetadata,
					createFormMetadata,
					defaultPageSize
			){
				$scope.csrfParamName = csrfParamName;
				$scope.csrfToken = csrfToken;
				$scope.csrfHeaderName = csrfHeaderName;
				$scope.server = server;
				var dataTable = entity + 'DataTable';
				var createForm = entity + 'Create';
				
				if (dataTableMetadata){
					$scope[dataTable] = new apiDataTable(
							$scope,
							entity,
							dataTableMetadata,
							defaultPageSize
					);
				}
				
				if (createFormMetadata && dataTableMetadata){
					$scope[createForm] = new apiForm(
							$scope,
							entity,
							createFormMetadata,
							function(){
								$scope[dataTable].update();
							}
					);
				}else if (createFormMetadata && !dataTableMetadata){
					$scope[createForm] = new apiForm(
							$scope,
							entity,
							createFormMetadata,
							function(){
								console.log("nothing to update-please specify data table metadata also.");
							}
					);
				}
			}
		}
	])
}(window.angular));