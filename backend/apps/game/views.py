from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import GameSession, Scenario
from .serializers import GameSessionSerializer, DecisionSerializer
from .services.game_engine import game_engine

class SessionStartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            session = game_engine.start_session(request.user)
            initial_scenario = game_engine.get_initial_scenario(session)
            response_data = GameSessionSerializer(session).data
            response_data['initial_scenario'] = initial_scenario
            return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DecisionSubmissionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = DecisionSerializer(data=request.data)
        if serializer.is_valid():
            session_id = request.data.get('session_id')
            scenario_id = serializer.validated_data['scenario_id']
            choice_data = serializer.validated_data['choice_data']
            
            try:
                session = GameSession.objects.get(id=session_id, user=request.user)
                if session.status != 'Active':
                    return Response({"error": "Session is not active"}, status=status.HTTP_400_BAD_REQUEST)
                    
                result = game_engine.process_player_decision(session, scenario_id, choice_data)
                return Response(result, status=status.HTTP_200_OK)
            except GameSession.DoesNotExist:
                return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
            except Scenario.DoesNotExist:
                return Response({"error": "Scenario not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SessionEndView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            session = GameSession.objects.get(id=pk, user=request.user)
            report = game_engine.end_session(session)
            return Response({
                "message": "Session completed successfully",
                "report_id": report.id,
                "profile": report.final_profile
            }, status=status.HTTP_200_OK)
        except GameSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class SessionListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sessions = GameSession.objects.filter(user=request.user)
        return Response(GameSessionSerializer(sessions, many=True).data)

class ScenarioListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        scenarios = Scenario.objects.all()
        from .serializers import ScenarioSerializer
        return Response(ScenarioSerializer(scenarios, many=True).data)
