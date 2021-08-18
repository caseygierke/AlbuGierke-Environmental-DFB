from django.shortcuts import render
from django.views.generic import TemplateView
from django.conf import settings

# Create your views here.
class HomePageView(TemplateView):
	template_name = 'home.html'

class AboutPageView(TemplateView):
	template_name = 'about.html'

class ContactPageView(TemplateView):
	template_name = 'contact.html'

class ServicesPageView(TemplateView):
	template_name = 'services.html'

class ToolsPageView(TemplateView):
	template_name = 'tools.html'

class CoachingPageView(TemplateView):

    template_name = 'coaching.html'

    def get_context_data(self, *args, **kwargs):
        context = super(CoachingPageView, self).get_context_data()
        context['apiKey'] = settings.GOOGLE_MAPS_API_KEY
        print(context)
        return context

    # context = {
    #     'api_key': settings.GOOGLE_MAPS_API_KEY
    # }

class COVIDpageView(TemplateView):
	template_name = 'COVIDtracker.html'

<<<<<<< HEAD
class COVIDworldPageView(TemplateView):
	template_name = 'COVIDtrackerWorld.html'

=======
>>>>>>> 32e0c8f8d1087b6828214b75e22cfea0a79b59d8
class EMDRpageView(TemplateView):
	template_name = 'EMDRbar.html'
