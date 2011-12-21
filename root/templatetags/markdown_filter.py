from django import template
import markdown
import re

from django.utils.safestring import mark_safe


register = template.Library()


class LineBreaks(markdown.preprocessors.Preprocessor):
    def run(self, lines):
        newlines = []
        for line in lines:
            tmp = re.match(r'^\s*$',line)
            if not tmp:
                newlines.append(line + u'<br />')
            else:
                newlines.append(line)
        return newlines

class ExtBlurTag(markdown.preprocessors.Preprocessor):
    def run(self, lines):
        newlines = []
        for line in lines:
            newline = re.sub(r'<blur>','<span class="blur">',line)
            newline = re.sub(r'</blur>','</span>',newline)
            newlines.append(newline)
        return newlines

class AlignClass(markdown.postprocessors.Postprocessor):
    def run(self, text):
        return re.sub(r'src="(?P<a>.+?)\|(?P<b>left|right)"','src="\g<a>" class="float-\g<b>"',text)

@register.filter(name='markdown')
def markdown_filter(value, arg):
    md = markdown.Markdown(
        safe_mode=False,
        output_format='html4')

    md.preprocessors.add('linebreaks',LineBreaks(),'_begin')
    md.preprocessors.add('extblurtag',ExtBlurTag(),'>linebreaks')
    md.postprocessors.add('alignclass',AlignClass(),'_begin')

    return mark_safe(md.convert(value))

