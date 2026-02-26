from django.db import models
from apps.game.models import GameSession

class PsychologicalMetric(models.Model):
    session = models.OneToOneField(GameSession, on_delete=models.CASCADE, related_name='metrics')
    risk_index = models.FloatField(default=0.0)
    loss_aversion = models.FloatField(default=0.0)
    ethical_drift = models.FloatField(default=0.0)
    adaptability_score = models.FloatField(default=0.0)
    confidence_stability = models.FloatField(default=0.0)
    resource_stewardship = models.FloatField(default=0.0)
    
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Metrics for Session {self.session.id}"

class PsychologicalReport(models.Model):
    session = models.OneToOneField(GameSession, on_delete=models.CASCADE, related_name='report')
    final_profile = models.CharField(max_length=100)
    analysis_data = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.session.user.username}"
