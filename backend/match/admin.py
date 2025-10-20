from django.utils.html import format_html
from django.contrib import admin
from .models import Match

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date', 'location', 'poster_preview')

    def poster_preview(self, obj):
        if obj.poster1 or obj.poster2:
            html = ''
            if obj.poster1:
                html += f'<img src="{obj.poster1}" width="70" height="90" style="object-fit:contain; margin-right:5px;" />'
            if obj.poster2:
                html += f'<img src="{obj.poster2}" width="70" height="90" style="object-fit:contain;" />'
            return format_html(html)
        return '-'
    poster_preview.short_description = 'Poster'
