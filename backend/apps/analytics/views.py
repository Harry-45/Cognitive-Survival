from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.psychology.models import PsychologicalReport

class PsychologicalReportView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            report = PsychologicalReport.objects.get(session_id=pk, session__user=request.user)
            return Response({
                "session_id": report.session.id,
                "final_profile": report.final_profile,
                "analysis": report.analysis_data,
                "generated_at": report.generated_at
            }, status=status.HTTP_200_OK)
        except PsychologicalReport.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
