'use strict';

var app = 
	angular.module(
			'app',
			[
				"ngRoute",
				"angular-bind-html-compile",
				"api",
				"apiWrapper",
				"apiForm",
				"apiDataTable",
				"apiControllerTemplate",
				'chieffancypants.loadingBar',
				'ngAnimate'
			]);
