from django.contrib import admin

from users.models import User


class UserAdmin(admin.ModelAdmin):
    """ Админка справочника пользователей. """
    ...


admin.site.register(User, UserAdmin)
