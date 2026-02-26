import logging

logger = logging.getLogger(__name__)

class MetricsEngine:
    """
    Service for calculating advanced psychological metrics based on decision history.
    """
    
    def calculate_metrics(self, session, decision_history):
        """
        Calculates 5 key psychological indices from decision history.
        """
        metrics = {
            'risk_index': self._calculate_risk(decision_history),
            'loss_aversion': self._calculate_loss_aversion(decision_history),
            'ethical_drift': self._calculate_ethical_drift(decision_history),
            'adaptability_score': self._calculate_adaptability(decision_history),
            'confidence_stability': self._calculate_confidence(decision_history),
            'resource_stewardship': self._calculate_stewardship(decision_history)
        }
        return metrics

    def _calculate_risk(self, history):
        if not history: return 0.0
        val = sum([float(d.get('risk_score', 0)) for d in history]) / len(history)
        return float(min(max(val * 10.0, 0.0), 100.0))

    def _calculate_loss_aversion(self, history):
        if not history: return 0.0
        # Reluctance to spend resources is a sign of loss aversion
        resource_retention = sum([float(d.get('resource_saved', 0)) for d in history])
        return float(min(100.0, resource_retention * 5.0))

    def _calculate_ethical_drift(self, history):
        if not history: return 0.0
        # Accumulation of ethical costs
        val = sum([float(d.get('ethical_cost', 0)) for d in history])
        return float(min(max(val, 0.0), 100.0))

    def _calculate_adaptability(self, history):
        if not history: return 0.0
        # Variety in choice patterns
        choices = set([d.get('choice_type') for d in history])
        return float(min(100.0, (float(len(choices)) / 4.0) * 100.0))

    def _calculate_confidence(self, history):
        if not history: return 100.0
        # Based on hesitation (lower is better)
        avg_hesitation = sum([float(d.get('hesitation_factor', 0)) for d in history]) / len(history)
        return float(max(0.0, 100.0 - avg_hesitation))

    def _calculate_stewardship(self, history):
        if not history: return 0.0
        # Ratio of positive resource changes vs total decisions
        resource_gains = sum([1 for d in history if float(d.get('resource_saved', 0)) > 0])
        return float(min(100.0, (resource_gains / len(history)) * 100.0))

metrics_engine = MetricsEngine()
