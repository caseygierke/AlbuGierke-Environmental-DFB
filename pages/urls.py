from django.urls import path
from .views import HomePageView, AboutPageView, ContactPageView, ServicesPageView, ToolsPageView, CoachingPageView

urlpatterns = [
	path('', HomePageView.as_view(), name='home'),
	path('about/', AboutPageView.as_view(), name='about'),
	path('contact/', ContactPageView.as_view(), name='contact'),
	path('coaching/', CoachingPageView.as_view(), name='coaching'),
	path('services/', ServicesPageView.as_view(), name='services'),
	path('tools/', ToolsPageView.as_view(), name='tools'),
]
