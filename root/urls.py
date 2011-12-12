from django.conf.urls.defaults import patterns, include, url

import py_frnkycom.root.views

urlpatterns = patterns('',
    url(r'^$','py_frnkycom.root.views.mainPage'),
)
