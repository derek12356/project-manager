'use strict';

angular.module('core.comment').
	directive('commentThread',function(Comment,$cookies){
		return {
			restrict: "E",
			scope: {
				comment: '=comment',
				slug:'=slug'
			},
			template:
			"<div class='row' ng-repeat='r in replies' style='margin-top:10px;'><div class='col-sm-12'>" +
				"<div class='panel panel-default'>" +
 				"<div class='panel-body' >"  + 
 					"{{ r.content }} <br/>" + 
                    "<small>via {{ r.user.username }}</small> " +
                    "<small ng-show='r.user.username == currentUser'>|" + 
                    " <a confirm-click='Are you sure to delete this?' " +
                   	"confirmed-click='deleteComment(r, comment)' href='#'>delete</a></small><br/>" +
 				"</div>" +
 				"</div>" +
 			"</div></div>"+
			// "<p style='color:red;' ng-if='reply.content'>preview:{{ reply.content }}</p>" + 
			 "<form ng-submit='addCommentReply(reply, comment)'>" +
                        "<div class=\"form-group\" ng-class=\"{'has-error': replyError.content }\"> " +
                            "<textarea class='form-control' id='replyText-{{ comment.id }}' ng-model='reply.content' placeholder='Reply Here'></textarea>" + 
                            "<label class=\"control-label\" for=\"replyText-{{ comment.id }}\" ng-if='replyError.content'>" + 
                               "<span ng-repeat='error in replyError.content'>{{ error }}<br/></span>" + 
                            "</label>" +
                         "</div>" + 
                           " <input class='btn btn-default btn-sm' type='submit' value='Reply'/>" + 
                        "</form>" ,
			link: function(scope,element,attr){
				if($cookies.get("token")){
					scope.currentUser = $cookies.get("username")
				}
				if(scope.comment){
					var commentId = scope.comment.id
					Comment.get({id: commentId},function(data){
						scope.replies = data.replies
					})
				}
					scope.reply = {}
					scope.$watch(function(){
						if(scope.reply.content){
					scope.replyError = {}
				}
			})
					
					scope.deleteComment = function(reply,parentComment){
						Comment.delete({"id": reply.id}, function(data){
                    var index = scope.replies.indexOf(reply)
                    scope.replies.splice(index, 1)
                    parentComment.reply_count -= 1
                },function(e_data){
                        console.log(e_data)
                    })
					}
				
					scope.addCommentReply = function(reply, parentComment){
					
					Comment.create({
							content: reply.content,
							slug: scope.slug,
							type: "post",
							parent_id: parentComment.id,
						},
						function(data){
							// console.log(data)
							if (parentComment){
								parentComment.reply_count += 1
							}else{
								parentComment.reply_count = 0
							}
							scope.replies.push(data)
							scope.replyError = ""
							// resetReply()
							
							reply.content = ""
						},
						function(e_data){
							console.log(e_data)
							scope.replyError = e_data.data
						}
					)
				}
			}
		}
	})