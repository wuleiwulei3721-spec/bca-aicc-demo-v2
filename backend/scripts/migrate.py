from pathlib import Path
import sys

# The migration folder is named ``alembic``. Remove the backend script path
# while importing the installed Alembic package so the two namespaces do not
# shadow each other when this module is loaded by backend/run.py.
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path[:] = [
    path
    for path in sys.path
    if not path or Path(path).resolve() != BACKEND_DIR
]

from alembic import command
from alembic.config import Config

sys.path.append(str(BACKEND_DIR))

from app.settings import settings
from scripts.create_database import create_local_database


def run_migrations() -> None:
    create_local_database()
    config = Config(str(BACKEND_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    config.set_main_option("sqlalchemy.url", settings.database_url.replace("%", "%%"))
    command.upgrade(config, "head")


if __name__ == "__main__":
    run_migrations()
    print("Common Phrase, Common Number, and Common Link migrations applied.")
