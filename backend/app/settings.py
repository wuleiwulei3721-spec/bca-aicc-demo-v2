from dataclasses import dataclass
from os import getenv
from urllib.parse import quote_plus


LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}
DEFAULT_DATABASE_NAME = "aicc_demo_local"


@dataclass(frozen=True)
class Settings:
    mysql_host: str = getenv("AICC_MYSQL_HOST", "127.0.0.1")
    mysql_port: int = int(getenv("AICC_MYSQL_PORT", "3306"))
    mysql_user: str = getenv("AICC_MYSQL_USER", "root")
    mysql_password: str = getenv("AICC_MYSQL_PASSWORD", "")
    mysql_database: str = getenv("AICC_MYSQL_DATABASE", DEFAULT_DATABASE_NAME)
    database_url_override: str = getenv("AICC_DATABASE_URL", "")
    api_host: str = getenv("AICC_API_HOST", "127.0.0.1")
    api_port: int = int(getenv("AICC_API_PORT", "8000"))

    @property
    def database_url(self) -> str:
        if self.database_url_override:
            return self.database_url_override

        return (
            "mysql+pymysql://"
            f"{quote_plus(self.mysql_user)}:{quote_plus(self.mysql_password)}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
            "?charset=utf8mb4"
        )

    def validate_local_database(self) -> None:
        host = self.mysql_host

        if self.database_url_override:
            from sqlalchemy.engine import make_url

            parsed = make_url(self.database_url_override)
            host = parsed.host or ""
            database = parsed.database or ""
        else:
            database = self.mysql_database

        if host not in LOCAL_HOSTS:
            raise RuntimeError(
                "Refusing to use a non-local database host. "
                "Set AICC_MYSQL_HOST to 127.0.0.1 for the independent demo database."
            )

        if database != DEFAULT_DATABASE_NAME:
            raise RuntimeError(
                f"Refusing database '{database}'. The local backend only allows "
                f"'{DEFAULT_DATABASE_NAME}'."
            )


settings = Settings()
settings.validate_local_database()
