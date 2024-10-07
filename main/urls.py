from django.urls import path
from . import views

urlpatterns = [
    # get
    path('', views.index),
    path('get-faqs/', views.get_faqs, name='get-faqs'),
    path('property/<int:property_id>/', views.property_page, name='property_page'),

    # post
    path('submit-faq/', views.submit_faq, name='submit_faq'),
    path('submit-review/', views.submit_review, name='submit_review'),
]
