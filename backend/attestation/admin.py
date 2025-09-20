from django.contrib import admin

from attestation.models import (
    Belt, Participant, Group, Option,
    ComplexGroup, Complex, BeltDemand,
    Attestation, ParticipantGroup
)


class BeltAdmin(admin.ModelAdmin):
    """ Админка справочника поясов. """
    ...


class ParticipantAdmin(admin.ModelAdmin):
    """ Админка справочника участников. """
    ...


class GroupAdmin(admin.ModelAdmin):
    """ Админка справочника групп. """
    ...


class ComplexGroupAdmin(admin.ModelAdmin):
    """ Админка комплекса групп. """
    ...


class ComplexAdmin(admin.ModelAdmin):
    """ Админка справочника комплексов. """
    ...


class BeltDemandAdmin(admin.ModelAdmin):
    """ Админка требований к поясам. """
    ...


class ParticipantGroupAdmin(admin.ModelAdmin):
    """ Админка связи участников и групп. """
    ...


class AttestationAdmin(admin.ModelAdmin):
    """ Админка аттестации. """
    ...


class OptionAdmin(admin.ModelAdmin):
    """ Админка опций. """
    ...


admin.site.register(Belt, BeltAdmin)
admin.site.register(Participant, ParticipantAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(ComplexGroup, ComplexGroupAdmin)
admin.site.register(Complex, ComplexAdmin)
admin.site.register(BeltDemand, BeltAdmin)
admin.site.register(ParticipantGroup, ParticipantGroupAdmin)
admin.site.register(Attestation, AttestationAdmin)
admin.site.register(Option, OptionAdmin)
