from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    # The Root app URLs
    url(r'^$', include('py_frnkycom.root.urls')),

    # The Blog app URLs
    #url(r'^blog/', include('py_frnkycom.root.urls')),



    # The default admin URLs
    url(r'^admin/', include(admin.site.urls)),
)
