from django.contrib import admin

from attestation.models import (
    Belt, Participant, Group, Option,
    ComplexGroup, Complex, BeltDemand,
    Attestation, ParticipantGroup,
    PhysicalTest, AdditionalTest,
    AdditionalTestCriteria, PhysicalTestPoint,
    PhysicalTestDemand
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


class PhysicalTestAdmin(admin.ModelAdmin):
    """ Админка физических комплексов. """
    ...


class AdditionalTestAdmin(admin.ModelAdmin):
    """ Админка дополнительных комплексов. """
    ...


class AdditionalTestCriteriaAdmin(admin.ModelAdmin):
    """ Админка критериев дополнительных комплексов. """
    ...


class PhysicalTestPointAdmin(admin.ModelAdmin):
    """ Админка критериев физических тестов. """
    ...


class PhysicalTestDemandAdmin(admin.ModelAdmin):
    """ Админка требований физических комплексов. """
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
admin.site.register(PhysicalTest, PhysicalTestAdmin)
admin.site.register(AdditionalTest, AdditionalTestAdmin)
admin.site.register(AdditionalTestCriteria, AdditionalTestCriteriaAdmin)
admin.site.register(PhysicalTestPoint, PhysicalTestPointAdmin)
admin.site.register(PhysicalTestDemand, PhysicalTestDemandAdmin)
