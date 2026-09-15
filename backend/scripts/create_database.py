import re
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pymysql

from app.settings import DEFAULT_DATABASE_NAME, LOCAL_HOSTS, settings


def create_local_database() -> None:
    if settings.mysql_host not in LOCAL_HOSTS:
        raise RuntimeError("The database bootstrap only allows a local MySQL host.")
    if settings.mysql_database != DEFAULT_DATABASE_NAME:
        raise RuntimeError(
            f"The database bootstrap only allows '{DEFAULT_DATABASE_NAME}'."
        )
    if not re.fullmatch(r"[A-Za-z0-9_]+", settings.mysql_database):
        raise RuntimeError("The database name contains unsupported characters.")

    connection = pymysql.connect(
        host=settings.mysql_host,
        port=settings.mysql_port,
        user=settings.mysql_user,
        password=settings.mysql_password,
        autocommit=True,
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{settings.mysql_database}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
    finally:
        connection.close()


if __name__ == "__main__":
    create_local_database()
    print(f"Local MySQL database ready: {settings.mysql_database}")
