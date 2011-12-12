# coding=utf8
from django.shortcuts import render_to_response

from py_frnkycom.root.models import MainPageContent


def mainPage(request):

    data    = {
        'pageContent': MainPageContent.objects.all().order_by('-datetime')[0].content
    }

    return render_to_response('root/root.html',data)

