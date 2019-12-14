from django.views.generic import FormView
from App1.functional_python import get_image
from App1 import forms as App1_forms


class HomePageView(FormView):
	template_name = 'plot.html'
	form_class = App1_forms.MyForm

	def form_valid(self, form, *args, **kwargs):
		# this code is also in the django-matplotlib example
		return None
		# response = super().form_valid(*args, **kwargs)
	 #    plot = get_image(param1) # Probably more
		# context = {
		#     'plot': plot
		# }
		# return context
