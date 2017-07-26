'use strict';

angular.module('project').
	config(
		function(
				$locationProvider,
				$routeProvider,
				$resourceProvider,
				$httpProvider
				
				
				 ){
				$httpProvider.defaults.withCredentials = true;
  				$httpProvider.defaults.xsrfCookieName = 'csrftoken';
  				$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  				
				$locationProvider.html5Mode({
					enabled:true
				})
				$resourceProvider.defaults.stripTrailingSlashes = false;
				$routeProvider.
				 	when("/",{
				 		template:"<blog-list></blog-list>"
				 	}).
				 	when("/about",{
				 		templateUrl:"api/templates/about.html"
				 	}).
				 	when("/blog",{
				 	 	template:"<blog-list></blog-list>"
				 	}).
				 	when("/blog/:slug",{
				 	 	template:"<blog-detail></blog-detail>"
				 	}).
				 	when("/login",{
				 	 	template:"<login-detail></login-detail>"
				 	}).
				 	when("/create",{
				 	 	template:"<create-detail></create-detail>"
				 	}).
				 	when("/register",{
				 	 	template:"<register-detail></register-detail>"
				 	}).
				 	when("/logout",{
				 	 	redirectTo:'/login'
				 	}).
				 	// when("/blog/2/",{
				 	// 	template:"<h1>Hi 2</h1>"
				 	// }).
				 	otherwise({
				 		template:"Not Found"
				 	})
	});