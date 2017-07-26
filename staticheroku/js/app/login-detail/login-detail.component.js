'use strict';

angular.module('loginDetail').
	component('loginDetail',{

		// template:"<div class='' ><h1 class='new-class' >{{ title }}</h1><button ng-click='clickFunction()'>Click me</button></div>",
		templateUrl : '/api/templates/login-detail.html',
		controller: function($cookies, $http, $routeParams, $scope,$rootScope,$location){
			var loginUrl = '/api/users/login/'		


			$scope.loginError = {}
            $scope.user = {

            }
			$scope.$watch(function(){
				if($scope.user.username){
					$scope.loginError.username = ""
				}else if($scope.user.password){
					$scope.loginError.password = ""
				}
			})

			var tokenExists = $cookies.get("token")
			console.log(tokenExists)
            if (tokenExists) {
                // verify token
                $scope.loggedIn = true;
                $cookies.remove("token")
                $scope.user = {
                    username: $cookies.get("username")
                }
                window.location.reload()
            }
			$scope.doLogin = function(user){
				if (!user.username) {
                    $scope.loginError.username = ["This field may not be blank."]
                } 
                if (!user.password) {
                    $scope.loginError.password = ["This field is required."]
                }
                if (user.username && user.password) {
				var reqConfig = {
					method: "POST",
					url: loginUrl,
					data:{
						username:user.username,
						password:user.password
					},
					headers:{}
				}
				var requestAction = $http(reqConfig)

				requestAction.success(function(r_data,r_status,r_headers,r_config){
					// console.log(user.username)
					$cookies.put("token",r_data.token)
					$cookies.put("username", user.username)
					$location.path("/")
					window.location.reload()
				})
				requestAction.error(function(e_data,e_status,e_headers,e_config){
					// console.log(e_data)
					$scope.loginError = e_data
				})
			}
		  }
		}
	})
