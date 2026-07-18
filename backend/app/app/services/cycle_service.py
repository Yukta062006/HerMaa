from datetime import datetime, timedelta


class CycleService:
    @staticmethod
    def calculate_phase(last_period: datetime, cycle_length: int = 28) -> dict:
        today = datetime.utcnow()
        days = (today - last_period).days
        current_day = (days % cycle_length) + 1

        if current_day <= 5: phase = "menstrual"
        elif current_day <= 13: phase = "follicular"
        elif current_day <= 16: phase = "ovulation"
        else: phase = "luteal"

        days_until = cycle_length - current_day + 1
        next_period = today + timedelta(days=days_until)

        return {
            "current_day": current_day,
            "cycle_length": cycle_length,
            "phase": phase,
            "next_period": next_period.isoformat(),
            "days_until_next": days_until,
        }
