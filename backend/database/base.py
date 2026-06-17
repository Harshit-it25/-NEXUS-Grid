# /backend/database/base.py
# Import all the models, so that Base has them before being
# imported by migrations or db initializers
from backend.database.session import Base  # noqa
from backend.models.models import (  # noqa
    Substation,
    TransmissionLine,
    RenewableAsset,
    ScenarioRun,
    PrioritizedProjectModel,
    ModernizationStrategyModel
)
