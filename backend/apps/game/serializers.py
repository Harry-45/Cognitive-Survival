from rest_framework import serializers
from apps.game.models import GameSession, Scenario, PlayerDecision

class ScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scenario
        fields = '__all__'

class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = '__all__'

class DecisionSerializer(serializers.Serializer):
    scenario_id = serializers.IntegerField()
    choice_data = serializers.JSONField()
