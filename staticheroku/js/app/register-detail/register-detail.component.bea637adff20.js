'use strict';

angular.module('registerDetail').
	component('registerDetail',{

		// template:"<div class='' ><h1 class='new-class' >{{ title }}</h1><button ng-click='clickFunction()'>Click me</button></div>",
		templateUrl : '/api/templates/register-detail.html',
		controller: function($cookies, $http, $routeParams, $scope,$rootScope,$location){
			var registerUrl = '/api/users/register/'
			$scope.user = {
			}
			


			$scope.registerError = {}
            $scope.user = {

            }
			$scope.$watch(function(){
				if ($scope.user.username) {
                    $scope.registerError.username = ""
                } else if ($scope.user.password) {
                    $scope.registerError.password = ""
                } else if ($scope.user.email) {
                    $scope.registerError.email = ""
                } else if ($scope.user.email2) {
                    $scope.registerError.email2 = ""
                } 
			})
			var tokenExists = $cookies.get("token")
				if(tokenExists){
					
				}
				// window.location.reload()

			
			$scope.doRegister = function(user){
				if (!user.username) {
                    $scope.registerError.username = ["This field may not be blank."]
                } 
                if (!user.email) {
                    $scope.registerError.email = ["This field may not be blank."]
                } 

                if (!user.email2) {
                    $scope.registerError.email2 = ["This field may not be blank."]
                } 

                if (user.email && user.email != user.email2) {
                    $scope.registerError.email2 = ["Your emails must match."]
                }


                if (!user.password) {
                    $scope.registerError.password = ["This field is required."]
                }
				if(user.username && user.email && user.email2 && user.password){
				var reqConfig = {
					method: "POST",
					url: registerUrl,
					data:{
						username:user.username,
						email:user.email,
						email2:user.email2,
						password:user.password

					},
					headers:{}
				}
				var requestAction = $http(reqConfig)
				
				// var requestAction = $http.post(loginUrl, user)

				requestAction.success(function(r_data,r_status,r_headers,r_config){
					// console.log(r_data)

					$cookies.put("token",r_data.token)
					$cookies.put("username", r_data.username)
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
