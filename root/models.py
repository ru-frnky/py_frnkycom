from django.db import models

class MainPageContent(models.Model):
    datetime    = models.DateTimeField()
    content     = models.TextField()

    def __unicode__(self):
        return unicode(self.content)

    class Meta:
        verbose_name = u'main page content'
        verbose_name_plural = u'main page contents'
