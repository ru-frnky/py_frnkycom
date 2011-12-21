# Django settings for py_frnkycom project.

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Frankie', 'frnky@frnky.com'),
)

MANAGERS = ADMINS





DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'C:/db.sqlite',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

TIME_ZONE = 'Asia/Vladivostok'

LANGUAGE_CODE = 'ru-ru'





SITE_ID = 1

USE_I18N = True
USE_L10N = False # Disabled some date formatting - i'll have to do that myself, anyway

MEDIA_ROOT = '' # Path to user-uploaded files
MEDIA_URL = '' # URL for user-uploaded files (w/ trailing slash)


STATIC_ROOT = 'c:/Temp/static/' # Path to the directory where the static files are collected to
STATIC_URL = '/static/' # URL prefix for static files (w/ trailing slash)
ADMIN_MEDIA_PREFIX = '/static/admin/' # URL prefix for admin static files (w/ trailing slash)
STATICFILES_DIRS = ( # Additional locations of static files
    'C:\Users\Frankie\PycharmProjects\py_frnkycom\static',
    # Paths to the static file dirs

)





# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'c$lh(-sd31a38o=zo0-0j1h+d-)nje*@%t0j#tr(su*gkr$h=1'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'py_frnkycom.urls'

TEMPLATE_DIRS = ('C:/Users/Frankie/PycharmProjects/py_frnkycom/templates',)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.admin',


    'py_frnkycom.root',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
