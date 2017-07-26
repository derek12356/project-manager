from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from rest_framework.generics import (
	CreateAPIView,
	DestroyAPIView,
	ListAPIView,
	UpdateAPIView,
	RetrieveAPIView,
	RetrieveUpdateAPIView,
	)
from rest_framework.mixins import DestroyModelMixin, UpdateModelMixin
from rest_framework.filters import (
	SearchFilter,
	OrderingFilter,
	)
from posts.api.permissions import IsOwnerOrReadOnly
from posts.api.pagination import PostLimitOffsetPagination
from rest_framework.permissions import(
	AllowAny,
	IsAuthenticated,
	IsAdminUser,
	IsAuthenticatedOrReadOnly,
	)
from comments.models import Comment 

from comments.api.serializers import (
	CommentCreateSerializer,
	CommentListSerializer,
	CommentDetailSerializer,
	create_comment_serializer,
	
	)



class CommentCreateAPIView(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentCreateSerializer

    def get_serializer_context(self):
        context = super(CommentCreateAPIView, self).get_serializer_context()
        context['user'] = self.request.user
        return context

	# def perform_create(self,serializer):
	# 	serializer.save(user=self.request.user)


# class PostDeleteAPIView(DestroyAPIView):
	
# 	queryset = Post.objects.all()
# 	serializer_class = PostListSerializer
# 	lookup_field = 'slug'
# 	permission_classes = [IsAuthenticated]

# class PostUpdateAPIView(RetrieveUpdateAPIView):
	
# 	queryset = Post.objects.all()
# 	serializer_class = PostListSerializer
# 	lookup_field = 'slug'
# 	permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]
# 	def perform_update(self,serializer):
# 		serializer.save(user=self.request.user)

class CommentDetailAPIView(DestroyModelMixin, UpdateModelMixin, RetrieveAPIView):
	queryset = Comment.objects.filter(id__gte=0)
	serializer_class = CommentDetailSerializer
	permission_classes = [IsOwnerOrReadOnly]

	def put(self, request, *args, **kwargs):
	    return self.update(request, *args, **kwargs)

	def delete(self, request, *args, **kwargs):
	    return self.destroy(request, *args, **kwargs)

class CommentListAPIView(ListAPIView):
	permission_classes = [AllowAny]
	filter_backends = [SearchFilter,OrderingFilter]
	search_fields = ['content','user']
	serializer_class = CommentListSerializer
 	pagination_class = PostLimitOffsetPagination

	def get_queryset(self, *args, **kwargs):
	    #queryset_list = super(PostListAPIView, self).get_queryset(*args, **kwargs)
	    queryset_list = []
	    query = self.request.GET.get("q")
	    slug = self.request.GET.get("slug") # content we commented on
	    type = self.request.GET.get("type", "post") # content type
	    if slug:
	        model_type      = type
	        model_qs        = ContentType.objects.filter(model=model_type)
	        if model_qs.exists():  
	            SomeModel       = model_qs.first().model_class()
	            obj_qs          = SomeModel.objects.filter(slug=slug) #Post.objects.filter(slug=slug)
	            if obj_qs.exists():
	                content_obj     = obj_qs.first()
	                queryset_list   = Comment.objects.filter_by_instance(content_obj)
	    else:
	        queryset_list = Comment.objects.filter(id__gte=0) #filter(user=self.request.user)

	    if query:
	        queryset_list = queryset_list.filter(
	                Q(content__icontains=query)|
	                Q(user__first_name__icontains=query) |
	                Q(user__last_name__icontains=query)
	                ).distinct()
	    return queryset_list