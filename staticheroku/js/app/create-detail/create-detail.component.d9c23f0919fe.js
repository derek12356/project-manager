'use strict';

angular.module('createDetail').
	component('createDetail',{

		// template:"<div class='' ><h1 class='new-class' >{{ title }}</h1><button ng-click='clickFunction()'>Click me</button></div>",
		templateUrl : '/api/templates/create-detail.html',
		controller: function($cookies, $http, $routeParams, $scope,$rootScope,$location){
			var createUrl = '/api/posts/create/'
			$scope.data = {

			}
			$scope.user = {

            }
			$scope.loginError = {}
			$scope.loggedIn = true;
			$scope.$watch(function(){
				if($scope.data.title){
					$scope.loginError.title = ""
				}else if($scope.data.content){
					$scope.loginError.content = ""
				}
				else if($scope.data.publish){
					$scope.loginError.publish = ""
				}
			})

			// var tokenExists = $cookies.get("token")
   //          if (tokenExists) {
   //              // verify token
   //              $scope.loggedIn = true;
   //              $cookies.remove("token")
   //              $scope.user = {
   //                  username: $cookies.get("username")
   //              }
   //              // window.location.reload()
   //          }
         	// $scope.currentUser = $cookies.get("username")
         	// $scope.token = $cookies.get("token")
			$scope.createPost = function(data){
				
				var token = $cookies.get("token")

				if (!data.title) {
                    $scope.loginError.title = ["This field may not be blank."]
                } 

                if (!data.content) {
                    $scope.loginError.content = ["This field may not be blank."]
                }
                // if (!data.publish) {
                //     $scope.loginError.publish = ["This field may not be blank."]
                // }

				var reqConfig = {
					method: "POST",
					url: createUrl,
					data:{
						title:data.title,
						content:data.content,
						publish:data.publish,
						// image:data.image,
						// username:data.username,
						// token:data.token,
					},
					headers:{
						"authorization":"JWT " + token
					}
				}
				
				var requestAction = $http(reqConfig)

				requestAction.success(function(r_data,r_status,r_headers,r_config){
					
					
					// $cookies.put("token",r_data.token)
					console.log(r_data)
					// $cookies.put("title", data.title)
					// $cookies.put("content", data.content)
					// $cookies.put("publish", data.publish)
					// $cookies.put("image", data.image)
					// $cookies.put("username",data.username)
					$location.path("/")
					window.location.reload()
					

				})
				requestAction.error(function(e_data,e_status,e_headers,e_config){
					// console.log(e_data)
					console.log(e_data)

				
				})
			}


		}
		
	})