from django.shortcuts import render,get_object_or_404,redirect
from django.http import HttpResponse,HttpResponseRedirect,Http404
from .models import Post
from .forms import PostForm
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render
from django.db.models import Q
from comments.models import Comment
from comments.forms import CommentForm
from django.contrib.contenttypes.models import ContentType 
# Create your views here.


def post_create(request):
	if not request.user.is_staff or not request.user.is_superuser:
		raise Http404
	form = PostForm(request.POST or None, request.FILES or None)
	if form.is_valid():
		instance = form.save(commit=False)
		instance.save()
		messages.success(request,"Succesfully Created")
		return HttpResponseRedirect(instance.get_absolute_url())
	# else:
	# 	messages.error(request,"Not Succesfully Created")
	context = {
		"form": form,
	}
	return render(request,"post_form.html",context)
def post_detail(request,slug=None):
	instance = get_object_or_404(Post,slug=slug)
	# content_type = ContentType.objects.get_for_model(Post)
	# obj_id = instance.id
	comments = instance.comments
	
	initial_data={
		"content_type":instance.get_content_type,
		"object_id":instance.id
	}
	form = CommentForm(request.POST or None, initial=initial_data)
	if form.is_valid() and request.user.is_authenticated():
		c_type = form.cleaned_data.get("content_type")
		content_type = ContentType.objects.get(model=c_type)
		obj_id = form.cleaned_data.get("object_id")
		content_data = form.cleaned_data.get("content")
		parent_id = request.POST.get("parent_id")
		parent_obj = None
		try:
			parent_id = int(request.POST.get("parent_id"))
		except:
			parent_id = None

		if parent_id:
			parent_qs = Comment.objects.filter(id=parent_id)
			if parent_qs.exists() and parent_qs.count() == 1:
				parent_obj = parent_qs.first()
				
		new_comment,created= Comment.objects.get_or_create(
			user = request.user,
			content_type = content_type,
			object_id = obj_id,
			content = content_data,
			parent = parent_obj,
			)
		return HttpResponseRedirect(new_comment.content_object.get_absolute_url())
	context={
		"title": instance.title,
		"instance": instance,
		"comments": comments,
		"comment_form":form,
	}
	return render(request,"post_detail.html",context)

def post_list(request):
	queryset_list = Post.objects.all()

	query = request.GET.get("q")
	if query:
		queryset_list = queryset_list.filter(

			Q(title__icontains=query)|
			Q(content__icontains=query)|
			Q(user__first_name__icontains=query)|
			Q(user__last_name__icontains=query)

			).distinct()


	paginator = Paginator(queryset_list, 5) # Show 25 contacts per page
	page = request.GET.get('page')
	try:
		queryset = paginator.page(page)
	except PageNotAnInteger:
# If page is not an integer, deliver first page.
		queryset = paginator.page(1)
	except EmptyPage:
# If page is out of range (e.g. 9999), deliver last page of results.
		queryset = paginator.page(paginator.num_pages)
	context = {
		"object_list": queryset,
		"title":"Blog"
}

	return render(request, "post_list.html",context)
	




def post_update(request,slug=None):
	if not request.user.is_staff or not request.user.is_superuser:
		raise Http404
		if not request.user.is_authenticated():
			raise Http404
	instance = get_object_or_404(Post,slug=slug)
	form = PostForm(request.POST or None, request.FILES or None, instance = instance)
	if form.is_valid():
		instance = form.save(commit=False)
		instance.save()
		messages.success(request,"Saved")
		return HttpResponseRedirect(instance.get_absolute_url())
	context={
		"title": instance.title,
		"instance": instance,
		"form":form,
	}
	return render(request,"post_form.html",context)
def post_delete(request,slug=None):
	# if not request.user.is_staff or not request.user.is_superuser:
		# raise Http404
	instance = get_object_or_404(Post, slug=slug)
	instance.delete()
	messages.success(request, "Successfully deleted")
	return redirect("posts:list")
def app1(request):
	context={
	"title" : "app1"
	}
	return render(request,"app1.html",context)

		