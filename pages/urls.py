from django.urls import path
<<<<<<< HEAD
from .views import HomePageView, AboutPageView, ContactPageView, ServicesPageView, ToolsPageView, CoachingPageView, COVIDpageView, COVIDworldPageView,EMDRpageView
=======
from .views import HomePageView, AboutPageView, ContactPageView, ServicesPageView, ToolsPageView, CoachingPageView, COVIDpageView, EMDRpageView
>>>>>>> 32e0c8f8d1087b6828214b75e22cfea0a79b59d8

urlpatterns = [
	path('', HomePageView.as_view(), name='home'),
	path('about/', AboutPageView.as_view(), name='about'),
	path('contact/', ContactPageView.as_view(), name='contact'),
	path('coaching/', CoachingPageView.as_view(), name='coaching'),
	path('services/', ServicesPageView.as_view(), name='services'),
	path('tools/', ToolsPageView.as_view(), name='tools'),
	path('COVIDtracker/', COVIDpageView.as_view(), name='COVIDtracker'),
<<<<<<< HEAD
	path('COVIDtracker/world/', COVIDworldPageView.as_view(), name='COVIDtrackerWorld'),
=======
>>>>>>> 32e0c8f8d1087b6828214b75e22cfea0a79b59d8
	path('EMDRbar/', EMDRpageView.as_view(), name='EMDRbar'),
]