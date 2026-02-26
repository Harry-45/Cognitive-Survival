from django.urls import path
from . import views

urlpatterns = [
    path('session/start/', views.SessionStartView.as_view(), name='session-start'),
    path('session/end/<int:pk>/', views.SessionEndView.as_view(), name='session-end'),
    path('decision/', views.DecisionSubmissionView.as_view(), name='decision-submit'),
    path('sessions/', views.SessionListView.as_view(), name='session-list'),
    path('scenarios/', views.ScenarioListView.as_view(), name='scenario-list'),
]
