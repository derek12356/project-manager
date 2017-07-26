from rest_framework.generics import (
	CreateAPIView,
	DestroyAPIView,
	ListAPIView,
	UpdateAPIView,
	RetrieveAPIView,
	RetrieveUpdateAPIView,
	)
from rest_framework.filters import (
	SearchFilter,
	OrderingFilter,
	)
from .pagination import PostLimitOffsetPagination
from rest_framework.permissions import(
	AllowAny,
	IsAuthenticated,
	IsAdminUser,
	IsAuthenticatedOrReadOnly,
	)
from posts.models import Post 
from .permissions import IsOwnerOrReadOnly
from posts.api.serializers import (
	PostCreateUpdateSerializer,
	PostDetailSerializer,
	PostListSerializer,
	)
from django.db.models import Q


class PostCreateAPIView(CreateAPIView):
	
	queryset = Post.objects.all()
	serializer_class = PostCreateUpdateSerializer
	permission_classes = [IsAuthenticated]

	def perform_create(self,serializer):
		serializer.save(user=self.request.user)

class PostDeleteAPIView(DestroyAPIView):
	
	queryset = Post.objects.all()
	serializer_class = PostListSerializer
	lookup_field = 'slug'
	permission_classes = [AllowAny]

class PostUpdateAPIView(RetrieveUpdateAPIView):
	
	queryset = Post.objects.all()
	serializer_class = PostCreateUpdateSerializer
	lookup_field = 'slug'
	permission_classes = [IsOwnerOrReadOnly]
	def perform_update(self,serializer):
		serializer.save(user=self.request.user)


class PostListAPIView(ListAPIView):
	
	filter_backends = [SearchFilter]
	search_fields = ['title', 'content','user__first_name']
	permission_classes = [AllowAny]
	queryset = Post.objects.all()
	serializer_class = PostListSerializer
 	lookup_field = 'slug'
 	pagination_class = PostLimitOffsetPagination

	def get_queryset(self, *args, **kwargs):
	    #queryset_list = super(PostListAPIView, self).get_queryset(*args, **kwargs)
	    queryset_list = Post.objects.all() #filter(user=self.request.user)
	    query = self.request.GET.get("q")
	    if query:
	        queryset_list = queryset_list.filter(
	                Q(title__icontains=query)|
	                Q(content__icontains=query)|
	                Q(user__first_name__icontains=query) |
	                Q(user__last_name__icontains=query)
	                ).distinct()
	    return queryset_list

class PostDetailAPIView(RetrieveAPIView):

	queryset = Post.objects.all()
	serializer_class = PostDetailSerializer
	permission_classes = [AllowAny]
	lookup_field = 'slug'
	lookup_url_kwarg = 'slug'


