from django.db import models
from django.contrib.auth.models import User

class Scenario(models.Model):
    CATEGORIES = [
        ('Resource Crisis', 'Resource Crisis'),
        ('Ethical Dilemma', 'Ethical Dilemma'),
        ('Social Conflict', 'Social Conflict'),
        ('Adaptive Challenge', 'Adaptive Challenge'),
        ('Technological Failure', 'Technological Failure'),
        ('Psychological Stress', 'Psychological Stress'),
        ('Environmental Hazard', 'Environmental Hazard'),
        ('Balanced', 'Balanced'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORIES)
    difficulty_level = models.IntegerField(default=1)
    impact_data = models.JSONField(help_text="Impact on resources and metrics")

    def __str__(self):
        return f"{self.title} ({self.category})"

class GameSession(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Completed', 'Completed'),
        ('Terminated', 'Terminated'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    current_difficulty = models.IntegerField(default=1)
    resources = models.JSONField(default=dict)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Session {self.id} - {self.user.username}"

class PlayerDecision(models.Model):
    session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name='decisions')
    scenario = models.ForeignKey(Scenario, on_delete=models.SET_NULL, null=True)
    choice_made = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Decision in {self.session.id} for {self.scenario.title}"
