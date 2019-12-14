from django import forms


class MyForm(forms.Form):
	param1 = forms.IntegerField()