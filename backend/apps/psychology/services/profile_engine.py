class ProfileEngine:
    """
    Service for generating detailed psychological reports at session end.
    """
    def generate_report(self, ai_profile, final_metrics):
        """
        Generates a structured report with radar chart mapping for the frontend.
        Mapping: Logic, Pragmatism, Aggression, Impulsivity, Intuition, Empathy
        """
        # Calculate radar points (0-100)
        radar_data = [
            final_metrics.get('confidence_stability', 50), # Logic
            final_metrics.get('loss_aversion', 50),       # Pragmatism
            final_metrics.get('risk_index', 50),          # Aggression
            50 + (final_metrics.get('ethical_drift', 0) / 2), # Impulsivity (higher drift ~ higher impulsivity)
            final_metrics.get('adaptability_score', 50),  # Intuition
            100 - final_metrics.get('ethical_drift', 0)   # Empathy (inverse of drift)
        ]

        return {
            "classification": ai_profile,
            "metrics": final_metrics,
            "radar_data": radar_data,
            "traits": self._extract_traits(final_metrics),
            "summary": self._generate_summary(ai_profile, final_metrics)
        }

    def _extract_traits(self, metrics):
        traits = []
        if metrics.get('risk_index', 0) > 70: traits.append("STRATEGIC")
        else: traits.append("CAUTIOUS")
        
        if metrics.get('ethical_drift', 0) > 50: traits.append("PRAGMATIC")
        else: traits.append("ALTRUISTIC")
        
        if metrics.get('adaptability_score', 0) > 60: traits.append("ANALYTICAL")
        else: traits.append("STABLE")
        
        return traits

    def _generate_summary(self, profile, metrics):
        if profile == "The Architect":
            return "Your patterns suggest a profound reliance on structured logic and systemic optimization. You prioritize the preservation of long-term assets over immediate emotional gains."
        if profile == "The Rogue":
            return "You operate with a high degree of independence and adaptability, often taking calculated risks to bypass traditional constraints."
        if profile == "The Guardian":
            return "Your focus is primarily on the stability and safety of the collective, often at the cost of personal resource gain."
        return f"Your behavioral signature suggests a {profile} approach, balancing survival needs with psychological stability."

profile_engine = ProfileEngine()
