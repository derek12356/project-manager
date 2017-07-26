'use strict';

angular.
	module('core.comment').
		factory('Comment',function(LoginRequiredInterceptor, $cookies, $httpParamSerializer, $location, $resource){
			var url = '/api/comments/:id/'
			var commentQuery = {
				url: url,
				params:{},
				method: "GET",
				isArray: true,
				cache: false,
				transformResponse:function(data, headersGetter, status){
						var finalData = angular.fromJson(data)
						return finalData.results
					}
			}
			var commentGet = {
					method: "GET",
					params:{"id":"@id"},
					isArray:false,
					cache:false,
			}
			var commentCreate = {
					url: '/api/comments/create/',
					method: "POST",
					interceptor:{responseError:LoginRequiredInterceptor}
			}
			var commentDelete = {
					url: '/api/comments/:id/',
					method: "DELETE",
					interceptor:{responseError:LoginRequiredInterceptor}
			}
			var commentUpdate = {
					url: '/api/comments/:id/',
					method: "PUT",
					interceptor:{responseError:LoginRequiredInterceptor}
			}
			var token = $cookies.get("token")

			if(token){
				commentCreate["headers"] = {"authorization": "JWT " + token}
				commentDelete["headers"] = {"authorization": "JWT " + token}
				commentUpdate["headers"] = {"authorization": "JWT " + token}
			}

			return $resource(url, {}, {
			query: commentQuery,
			get: commentGet,
			create:commentCreate,
			delete:commentDelete,
			update:commentUpdate,
			})

		});