import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'no secret')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.getenv('DEBUG', 'false').lower() == 'true' else False

USE_SQL = True if os.getenv('USE_SQL', 'false').lower() == 'true' else False

HOSTS = os.getenv('HOSTS', [])

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

for host in HOSTS.split(','):
    ALLOWED_HOSTS.append(host)


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_filters',
    'rest_framework',
    'djoser',
    'attestation',
    'users'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
    'AUTH_HEADER_TYPES': ('Token',)
}

CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

if USE_SQL:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
            'OPTIONS': {
                'timeout': 20
            }
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB', 'django'),
            'USER': os.getenv('POSTGRES_USER', 'django'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'django'),
            'HOST': os.getenv('DB_HOST', 'db'),
            'PORT': os.getenv('DB_PORT', 5432)
        }
    }

AUTH_PREFIX = 'django.contrib.auth.password_validation'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': f'{AUTH_PREFIX}.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 4
        }
    },
    {
        'NAME': f'{AUTH_PREFIX}.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Asia/Yekaterinburg'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'
STATIC_ROOT = 'collected_static/'
TEMPLATE_ROOT = BASE_DIR / 'tmp/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

DATE_FORMAT = '%d.%m.%Y'
STR_DATE_FORMAT = '%Y-%m-%d'
