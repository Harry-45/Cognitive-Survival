import logging
from datetime import datetime
from django.utils import timezone
from apps.game.models import GameSession, PlayerDecision, Scenario
from apps.psychology.models import PsychologicalMetric, PsychologicalReport
from apps.psychology.services.ai_engine import ai_engine
from apps.psychology.services.metrics_engine import metrics_engine
from apps.psychology.services.profile_engine import profile_engine

logger = logging.getLogger(__name__)

class GameEngine:
    """
    Main controller for the simulation gameplay and session lifecycle.
    """

    def start_session(self, user):
        """
        Initializes a new gameplay session.
        """
        session = GameSession.objects.create(
            user=user,
            status='Active',
            current_difficulty=1,
            resources={'water': 100, 'energy': 100, 'food': 100}
        )
        
        # Initialize psychological metrics
        PsychologicalMetric.objects.create(session=session)
        
        return session

    def process_player_decision(self, session, scenario_id, choice_data):
        """
        The 8-step pipeline for processing decisions.
        """
        # STEP 1: Save PlayerDecision
        scenario = Scenario.objects.get(id=scenario_id)
        choice_label = choice_data.get('label', 'Default Choice')
        
        decision = PlayerDecision.objects.create(
            session=session,
            scenario=scenario,
            choice_made=choice_label
        )

        # STEP 2: Update resources
        impact = scenario.impact_data.get(choice_label, {})
        session.resources = self._apply_impact(session.resources, impact.get('resources', {}))
        
        # STEP 3: Update psychological metrics
        # Fetch full history and enrich with actual impact data from scenarios
        decisions = session.decisions.all().order_by('timestamp').select_related('scenario')
        history_with_meta = []
        last_timestamp = session.start_time
        
        for d in decisions:
            if not d.scenario:
                continue
            d_impact = d.scenario.impact_data.get(d.choice_made, {})
            
            # Calculate hesitation: time between decisions (in seconds)
            hesitation = (d.timestamp - last_timestamp).total_seconds()
            last_timestamp = d.timestamp
            
            # resource_saved: sum of positive resource changes (gains)
            resources = d_impact.get('resources', {})
            resource_saved = sum([v for v in resources.values() if isinstance(v, (int, float)) and v > 0])
            
            history_with_meta.append({
                'choice_made': d.choice_made,
                'timestamp': d.timestamp,
                'risk_score': d_impact.get('risk_score', 0),
                'ethical_cost': d_impact.get('ethical_cost', 0),
                'resource_saved': resource_saved,
                'hesitation_factor': min(100, hesitation), # Cap at 100 for safety
                'choice_type': d_impact.get('choice_type', 'rational')
            })

        new_metrics = metrics_engine.calculate_metrics(session, history_with_meta)
        
        metrics_obj = session.metrics
        for key, value in new_metrics.items():
            setattr(metrics_obj, key, value)
        metrics_obj.save()

        # STEP 4-5: AI Predictions
        next_cat = ai_engine.predict_scenario_category(new_metrics, session.current_difficulty)
        diff_adj = ai_engine.predict_difficulty_adjustment(new_metrics, session.current_difficulty)

        # STEP 6: Adjust difficulty safely
        session.current_difficulty = max(1, min(5, session.current_difficulty + diff_adj))
        session.save()

        # STEP 7: Select next scenario
        decision_count = session.decisions.count()
        session_ended = False
        report_id = None

        if decision_count >= 8:
            report = self.end_session(session)
            session_ended = True
            report_id = report.id
            next_scenario_obj = None
        else:
            # Pass session to avoid repetitions
            next_scenario_obj = self._fetch_next_scenario(next_cat, session.current_difficulty, exclude_session=session)

        # STEP 8: Return structured response
        return {
            "updated_resources": session.resources,
            "psychological_metrics": new_metrics,
            "difficulty_level": session.current_difficulty,
            "next_scenario": next_scenario_obj,
            "session_ended": session_ended,
            "report_id": report_id
        }

    def end_session(self, session):
        """
        Finalizes the session and generates the psychological profile.
        """
        session.status = 'Completed'
        session.end_time = timezone.now()
        session.save()

        # Generate final report
        metrics = session.metrics
        metrics_data = {
            'risk_index': metrics.risk_index,
            'loss_aversion': metrics.loss_aversion,
            'ethical_drift': metrics.ethical_drift,
            'adaptability_score': metrics.adaptability_score,
            'confidence_stability': metrics.confidence_stability,
            'resource_stewardship': metrics.resource_stewardship
        }
        
        profile = ai_engine.predict_final_profile(metrics_data)
        report_data = profile_engine.generate_report(profile, metrics_data)
        
        report = PsychologicalReport.objects.create(
            session=session,
            final_profile=profile,
            analysis_data=report_data
        )
        
        return report

    def _apply_impact(self, current, impact):
        for k, v in impact.items():
            if k in current:
                current[k] = max(0, current[k] + v)
        return current

    def _fetch_next_scenario(self, category, difficulty, exclude_session=None):
        """
        Fetches next scenario while avoiding repetitions.
        Uses randomization and difficulty range (+/- 1) to maximize variety.
        """
        # Search for scenarios in a range around the target difficulty
        difficulty_range = [difficulty - 1, difficulty, difficulty + 1]
        queryset = Scenario.objects.filter(
            category=category, 
            difficulty_level__in=difficulty_range
        ).order_by('?') # Randomize selection
        
        if exclude_session:
            played_ids = exclude_session.decisions.all().values_list('scenario_id', flat=True)
            queryset = queryset.exclude(id__in=played_ids)

        scenario = queryset.first()
        
        # Fallback 1: Any scenario in the requested category regardless of difficulty
        if not scenario:
            queryset = Scenario.objects.filter(category=category).order_by('?')
            if exclude_session:
                played_ids = exclude_session.decisions.all().values_list('scenario_id', flat=True)
                queryset = queryset.exclude(id__in=played_ids)
            scenario = queryset.first()

        # Fallback 2: Balanced category
        if not scenario:
            fallback_qs = Scenario.objects.filter(category='Balanced').order_by('?')
            if exclude_session:
                played_ids = exclude_session.decisions.all().values_list('scenario_id', flat=True)
                fallback_qs = fallback_qs.exclude(id__in=played_ids)
            scenario = fallback_qs.first()
        
        # Absolute fallback: pick any available scenario
        if not scenario:
            scenario = Scenario.objects.exclude(
                id__in=exclude_session.decisions.all().values_list('scenario_id', flat=True) if exclude_session else []
            ).order_by('?').first()

        if not scenario:
            return None
            
        return {
            "id": scenario.id,
            "title": scenario.title,
            "description": scenario.description,
            "category": scenario.category,
            "difficulty": scenario.difficulty_level,
            "impact_data": scenario.impact_data
        }

    def get_initial_scenario(self, session):
        """
        Special fetch for the first scenario of a session.
        """
        return self._fetch_next_scenario('Balanced', 1, exclude_session=session)

game_engine = GameEngine()
