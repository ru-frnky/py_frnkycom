from django import template
import markdown

from django.utils.safestring import mark_safe


register = template.Library()

@register.filter(name='markdown')
def markdown_filter(value, arg):
    md = markdown.Markdown(
        safe_mode=False,
        output_format='html4')

    return mark_safe(md.convert(value))





