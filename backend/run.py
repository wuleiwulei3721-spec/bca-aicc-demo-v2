from pathlib import Path
import sys

import uvicorn

sys.path.append(str(Path(__file__).resolve().parent))

from app.settings import settings  # noqa: E402
from scripts.migrate import run_migrations  # noqa: E402


if __name__ == "__main__":
    run_migrations()
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=False,
    )
