from django.urls import path, include

from rest_framework import routers

from api.views import (
    BeltViewSet, ParticipantViewSet,
    OptionViewSet, ComplexGroupViewSet,
    ComplexViewSet, BeltDemandViewSet,
    AttestationViewSet, GroupViewSet,
    ParticipantGroupViewSet
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

urlpatterns = [
    path('', include(router.urls)),
    path('', include('djoser.urls')),
    path('', include('djoser.urls.jwt'))
]
