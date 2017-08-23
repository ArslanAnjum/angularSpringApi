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
					createFormMetadata
			){
				$scope.csrfParamName = csrfParamName;
				$scope.csrfToken = csrfToken;
				$scope.csrfHeaderName = csrfHeaderName;
				$scope.server = server;
				var dataTable = entity + 'DataTable';
				var createForm = entity + 'Create';
				
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
		}
	])
}(window.angular));