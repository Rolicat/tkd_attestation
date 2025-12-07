from django.urls import path, include

from rest_framework import routers

from api.views import (
    BeltViewSet, ParticipantViewSet,
    OptionViewSet, ComplexGroupViewSet,
    ComplexViewSet, BeltDemandViewSet,
    AttestationViewSet, GroupViewSet,
    ParticipantGroupViewSet, PhysicalTestViewSet,
    AdditionalTestViewSet, AdditionalTestCriteriaViewSet,
    AdditionalTestDemandViewSet, PhysicalTestDemandViewSet,
    PhysicalTestPointViewSet, AttestationInfoViewSet,
    AgePeriodViewSet
)

router = routers.DefaultRouter()
router.register('belts', BeltViewSet)
router.register('participants', ParticipantViewSet)
router.register('groups', GroupViewSet)
router.register('options', OptionViewSet)
router.register('complex_groups', ComplexGroupViewSet)
router.register('complexes', ComplexViewSet)
router.register('belt_demands', BeltDemandViewSet)
router.register('attestations', AttestationViewSet)
router.register('participant_group', ParticipantGroupViewSet)
router.register('physical_tests', PhysicalTestViewSet)
router.register('additional_tests', AdditionalTestViewSet)
router.register('additional_test_criteria', AdditionalTestCriteriaViewSet)
router.register('additional_test_demands', AdditionalTestDemandViewSet)
router.register('physical_test_demands', PhysicalTestDemandViewSet)
router.register('physical_test_points', PhysicalTestPointViewSet)
router.register('attestation_info', AttestationInfoViewSet)
router.register('age_period', AgePeriodViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', include('djoser.urls')),
    path('', include('djoser.urls.jwt'))
]
