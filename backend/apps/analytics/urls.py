from django.urls import path
from .views import PsychologicalReportView

urlpatterns = [
    path('report/<int:pk>/', PsychologicalReportView.as_view(), name='analytics_report'),
]
