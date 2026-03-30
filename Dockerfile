FROM python:3.11-slim-bookworm AS builder

WORKDIR /app

#Prevent Python from writing pyc files & enable logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

#Install Python dependencies into a separate directory
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

#Download NLTK data (important for ATS text processing)
RUN pip install --no-cache-dir nltk && \
    python -m nltk.downloader -d /nltk_data punkt punkt_tab stopwords


FROM python:3.11-slim-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV SENTENCE_TRANSFORMER_MODEL="/app/ml/models/finetuned-bert"

#Install runtime dependencies (for pdf parsing, NLP, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    libglib2.0-0 \
    libgdk-pixbuf-2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

#Copy installed Python packages
COPY --from=builder /install /usr/local
COPY --from=builder /nltk_data /usr/share/nltk_data

#Copy backend code
COPY backend/ ./backend/

# Copy ML models (fine-tuned BERT)
COPY ["ml model/finetuned-bert/", "./ml/models/finetuned-bert/"]

#Create non-root user and give it ownership of logs directory
RUN useradd --create-home appuser \
    && mkdir -p /app/backend/logs \
    && chown -R appuser:appuser /app/backend/logs
USER appuser

# Expose port
EXPOSE 8000


CMD ["gunicorn", "backend.main:app", \
     "-w", "1", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "300"]