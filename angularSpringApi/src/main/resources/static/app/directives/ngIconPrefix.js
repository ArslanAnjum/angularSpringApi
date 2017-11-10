
'use strict';

app.directive('ngIconPrefix',['$parse','$compile',function($parse,$compile){
	
	return {
		restrict : 'A',
		link : function (scope,elem,attrs){
			var optionsExp = attrs.ngOptions;
			var filtersName = attrs.ngIconPrefix;
			if (!optionsExp) return;
			
			scope.$watchCollection(
					function(){
						return elem.children();
					},
					function(newValue){
						angular.forEach(newValue,function(child){
							var child = angular.element(child);
							var val = child.val();
							if (val > 0 && filtersName){
								var color = scope[filtersName].arr[val].color;
								child.prepend("<a class='btn-floating tooltipped btn-mini "+color+"' style='height:15px;width:15px'></a>&nbsp&nbsp&nbsp");
								$compile(child)(scope);
							}
						});
					}
			);
			
		}
	}
}]);