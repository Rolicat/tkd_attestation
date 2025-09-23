FROM python:3.11

WORKDIR /backend

RUN pip install gunicorn==20.1.0

COPY . .

RUN pip install -r req.txt --no-cache-dir

CMD ["gunicorn", "--bind", "0.0.0.0:8001", "--timeout", "1200", "backend.wsgi"]