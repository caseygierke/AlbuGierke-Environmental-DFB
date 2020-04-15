"""pages_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from pages import urls as pages_urls
#from app1 import urls as app1_urls

# from django.conf.urls import patterns, include, url
# from django.conf.urls.static import static
# from django.contrib import admin
# from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# from myweblab import settings

# admin.autodiscover()

# urlpatterns = patterns('',
#     .......
# ) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(pages_urls)),
    # static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
]

# urlpatterns += staticfiles_urlpatterns()