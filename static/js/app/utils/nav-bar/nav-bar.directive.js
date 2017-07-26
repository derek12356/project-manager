'use strict';

angular.module('navBar').
	directive('navBar',function($cookies, Post, $location){
		return{
		
			restrict:'E',
			templateUrl:"/api/templates/nav-bar.html",
			link:function(scope,element,attr){
				scope.items = Post.query()
				scope.selectItem = function($item, $model, $label){
			
				$location.path("/blog/" + $item.slug)
				scope.searchQuery = ''
			}
			scope.searchItem =function(){

				$location.path("/blog/").search("q", scope.searchQuery)
				scope.searchQuery = ''
			}
			scope.userLoggedIn = false
			
			scope.$watch(function(){
			var token = $cookies.get("token")
			if(token){
				scope.userLoggedIn = true
			}
			else{
				scope.userLoggedIn = false
			}
			

			})
		  }
		}
	});