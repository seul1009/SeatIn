from django.contrib import admin
from .models import Seat

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('seat_id', 'section', 'x', 'y', 'z')
    list_filter = ('section',)
    search_fields = ('seat_id',)
    ordering = ('section',)
