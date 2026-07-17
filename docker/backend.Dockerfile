FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    COSMOS_HOST=0.0.0.0 \
    COSMOS_PORT=8000 \
    COSMOS_RUNTIME_PATH=/var/lib/cosmos

WORKDIR /app

COPY pyproject.toml README.md ./
COPY backend ./backend

RUN pip install --no-cache-dir .

VOLUME ["/var/lib/cosmos"]
EXPOSE 8000

CMD ["python", "-m", "cosmos"]
