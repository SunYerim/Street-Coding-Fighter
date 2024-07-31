from django.urls import path
from . import views

app_name = 'bots'

urlpatterns = [
    path('', views.index, name='index'),
]
