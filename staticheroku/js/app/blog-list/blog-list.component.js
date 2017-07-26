'use strict';

angular.module('blogList').
	component('blogList',{

		// template:"<div class='' ><h1 class='new-class' >{{ title }}</h1><button ng-click='clickFunction()'>Click me</button></div>",
		templateUrl : '/api/templates/blog-list.html',
		controller: function(Post, $cookies, $routeParams, $scope,$rootScope, $location,$timeout){
		// var slug = $routeParams.slug

		 	$scope.rate = 7;
            $scope.max = 10;
            $scope.isReadonly = false;

            $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
    };
            $scope.ratingStates = [
                {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
                {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
                {stateOn: 'glyphicon-heart'},
                {stateOff: 'glyphicon-off'}
    ];

		var q = $location.search().q
		$scope.oneAtATime = true;

		   
		
		if(q){
			$scope.query = q
			
		}
			$scope.order = '-publish'





			$scope.currentUser = $cookies.get("username")


			$scope.goToItem = function(post){
				$rootScope.$apply(function(){
					$location.path("/blog/" + post.slug )
					})
			}
				Post.query(function(data){
					$scope.items = data
				},
				function(errorData){

				});
          
			$scope.deletePost = function(post){
				Post.delete({"slug":post.slug + '/' + 'delete' })
				$timeout(function(){window.location.reload()},300)
			}

		
	
			// function chunkArrayInGroups(array, unit) {
   //              var results = [],
   //              length = Math.ceil(array.length / unit);
   //              for (var i = 0; i < length; i++) {
   //                  results.push(array.slice(i * unit, (i + 1) * unit));
   //              }
   //              return results;
   //          }
		}
	});
