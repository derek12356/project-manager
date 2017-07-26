from rest_framework.serializers import (
	ModelSerializer,
	HyperlinkedIdentityField,
	SerializerMethodField,
	ValidationError
)
from comments.models import Comment 
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model 

User = get_user_model()

class UserCreateSerializer(ModelSerializer):
	class Meta:
		model = User
		fields = [
			'username',
			'password',
			'email',
		]