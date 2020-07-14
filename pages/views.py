from django.shortcuts import render
from django.views.generic import TemplateView

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

class COVIDpageView(TemplateView):
	template_name = 'COVIDtracker.html'

class EMDRpageView(TemplateView):
	template_name = 'EMDRbar.html'

