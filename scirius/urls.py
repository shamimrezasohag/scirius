
from django.conf.urls import url, include
from django.conf import settings

from .views import homepage, KibanaProxyView, EveboxProxyView, MolochProxyView, static_redirect, ui_view
from .rest_api import router

urlpatterns = [
    url(r'^rules/', include('rules.urls')),
    url(r'^accounts/', include('accounts.urls')),
    url(r'^viz/', include('viz.urls')),
    url(r'^' + settings.RULESET_MIDDLEWARE + '/', include('' + settings.RULESET_MIDDLEWARE + '.urls')),
    url(r'^rest/', include(router.urls)),
    url(r'^stamus(/.*)?$', ui_view),
    url('^$', homepage),
    # Forward "app/kibana.*" to kibana (work around to https://github.com/elastic/kibana/issues/5230)
    url(r'^(?P<path>app/.*)$', KibanaProxyView.as_view()),
    url(r'^(?P<path>status.*)$', KibanaProxyView.as_view()),
    url(r'^(?P<path>api.*)$', KibanaProxyView.as_view()),
    url(r'^(?P<path>plugins.*)$', KibanaProxyView.as_view()),
    # Forward timelion plugin
    url(r'^(?P<path>timelion/.*)$', KibanaProxyView.as_view()),
    url(r'^(?P<path>bundles/.*)$', KibanaProxyView.as_view()),
    url(r'^(?P<path>elasticsearch/.*)$', KibanaProxyView.as_view()),
    url(r'^kibana/(?P<path>.*)$', KibanaProxyView.as_view()),
    url(r'^evebox/(?P<path>.*)$', EveboxProxyView.as_view()),
    # Kibana 5.2 specific
    url(r'^(?P<path>ui/fonts.*)$', KibanaProxyView.as_view()),
    url(r'^(?P<path>es_admin.*)$', KibanaProxyView.as_view()),

    # Moloch proxy
    url(r'^moloch/(?P<path>.*)$', MolochProxyView.as_view()),
]

if settings.STATIC_AUTHENTICATED:
    urlpatterns += [
        url(r'^static/(?P<static_path>.*)$', static_redirect, name='static_redirect'),
    ]
