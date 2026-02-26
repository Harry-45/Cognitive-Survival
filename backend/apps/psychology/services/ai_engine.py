import joblib
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class AIEngine:
    """
    Service layer for interacting with trained ML models.
    Models are loaded once at startup or on first access.
    """
    _scenario_model = None
    _difficulty_model = None
    _profile_model = None

    @classmethod
    def _load_model(cls, attr_name, path_setting):
        """Helper to load model from path specified in settings."""
        if getattr(cls, attr_name) is None:
            model_path = getattr(settings, path_setting, None)
            
            if not model_path:
                raise ValueError(f"Settings for {path_setting} is not defined.")
            
            if not os.path.exists(model_path):
                logger.error(f"Model file missing: {model_path}")
                raise FileNotFoundError(f"ML model file not found at {model_path}")
            
            try:
                setattr(cls, attr_name, joblib.load(model_path))
                logger.info(f"Successfully loaded model from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load model from {model_path}: {str(e)}")
                raise RuntimeError(f"Error loading model {attr_name}: {str(e)}")
        
        return getattr(cls, attr_name)

    @property
    def scenario_model(self):
        return self._load_model('_scenario_model', 'SCENARIO_MODEL_PATH')

    @property
    def difficulty_model(self):
        return self._load_model('_difficulty_model', 'DIFFICULTY_MODEL_PATH')

    @property
    def profile_model(self):
        return self._load_model('_profile_model', 'PROFILE_MODEL_PATH')

    def predict_scenario_category(self, metrics, current_difficulty):
        """
        Predicts next scenario category with rule-based fallback.
        """
        try:
            features = [list(metrics.values()) + [current_difficulty]]
            prediction = self.scenario_model.predict(features)
            return prediction[0]
        except Exception:
            # Rule-based fallback
            if metrics.get('risk_index', 0) > 70:
                return "Resource Crisis"
            if metrics.get('ethical_drift', 0) > 50:
                return "Ethical Dilemma"
            return "Balanced"

    def predict_difficulty_adjustment(self, metrics, current_difficulty):
        """
        Predicts difficulty adjustment with logical fallback.
        """
        try:
            features = [list(metrics.values()) + [current_difficulty]]
            adjustment = self.difficulty_model.predict(features)
            return int(adjustment[0])
        except Exception:
            # Fallback: Increase difficulty if adaptability is high
            if metrics.get('adaptability_score', 0) > 80:
                return 1
            if metrics.get('confidence_stability', 0) < 30:
                return -1
            return 0

    def predict_final_profile(self, session_metrics):
        """
        Classifies final profile with fallback to specific archetypes.
        """
        try:
            features = [list(session_metrics.values())]
            profile = self.profile_model.predict(features)
            # Map model output to friendly names if needed
            return profile[0]
        except Exception:
            # Fallback heuristics for the 3 main archetypes
            if session_metrics.get('ethical_drift', 0) > 60:
                return "The Rogue"
            if session_metrics.get('risk_index', 0) < 30:
                return "The Guardian"
            return "The Architect"

# Create a singleton instance for global use
ai_engine = AIEngine()
