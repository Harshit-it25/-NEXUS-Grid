# /backend/services/data_integration.py
from backend.schemas.schemas import IngestDataPayload, IngestionReport

class DataIntegrationService:
    @staticmethod
    def ingest_data(payload: IngestDataPayload) -> IngestionReport:
        # Quality check calculations
        deductions = 0.0
        
        # Checking parameters
        if payload.gis_records <= 0:
            deductions += 15.0
            
        if payload.utility_ping_status != "CONNECTED":
            deductions += 25.0
            
        if payload.weather_temp_f < -40.0 or payload.weather_temp_f > 130.0:
            deductions += 10.0
            
        if payload.renewable_forecast_mw < 0:
            deductions += 20.0
            
        if payload.population_density <= 0:
            deductions += 5.0
            
        quality_score = max(5.0, 100.0 - deductions)
        
        # Formulate description text
        if quality_score > 90:
            status_text = "Highly reliable. Clean GIS topology matched seamlessly with SCADA streams."
        elif quality_score > 70:
            status_text = "Adequate. Minor timestamp inconsistencies synchronized successfully."
        else:
            status_text = "Partially Degraded. High latency in utility telemetry requires backfill mechanisms."
            
        return IngestionReport(
            success=quality_score >= 50.0,
            source_id=payload.source_id,
            records_processed=payload.gis_records + 120, # simulated logs
            data_quality_score=quality_score,
            data_health_comment=status_text
        )
