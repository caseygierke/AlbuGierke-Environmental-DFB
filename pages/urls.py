from django.urls import path
<<<<<<< HEAD
from .views import HomePageView, AboutPageView, ContactPageView, ServicesPageView, ToolsPageView, CoachingPageView, COVIDpageView
=======
from .views import HomePageView, AboutPageView, ContactPageView, ServicesPageView, ToolsPageView, CoachingPageView, COVIDpageView, EMDRpageView
>>>>>>> tmp

urlpatterns = [
	path('', HomePageView.as_view(), name='home'),
	path('about/', AboutPageView.as_view(), name='about'),
	path('contact/', ContactPageView.as_view(), name='contact'),
	path('coaching/', CoachingPageView.as_view(), name='coaching'),
	path('services/', ServicesPageView.as_view(), name='services'),
	path('tools/', ToolsPageView.as_view(), name='tools'),
	path('COVIDtracker/', COVIDpageView.as_view(), name='COVIDtracker'),
<<<<<<< HEAD
=======
	path('EMDRbar/', EMDRpageView.as_view(), name='EMDRbar'),
>>>>>>> tmp
]
