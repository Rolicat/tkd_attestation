from http import HTTPStatus

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from attestation.models import (
    Belt, Participant, Group, Option,
    ComplexGroup, Complex, BeltDemand,
    Attestation, ParticipantGroup
)

from api.serializers import (
    BeltSerializer, ParticipantSerializer,
    GroupSerializer, OptionSerializer,
    ComplexGroupSerializer, ComplexSerializer,
    BeltDemandSerializer, AttestationSerializer,
    BeltDemandUsedSerializer, ComplexGroupTreeSerializer,
    GroupTreeSerializer, ParticipantGroupPropertiesSerializer,
    ParticipantGroupSerializer, AttestationComplexSerializer
)


class BeltViewSet(viewsets.ModelViewSet):
    """ API справочника поясов. """
    queryset = Belt.objects.all().order_by('id')
    serializer_class = BeltSerializer


class ParticipantViewSet(viewsets.ModelViewSet):
    """ API справочника участников. """
    queryset = Participant.objects.all().order_by(
        'surname', 'name', 'patronymic'
    )
    serializer_class = ParticipantSerializer

    @action(methods=('get',), detail=False)
    def filter(self, request):
        """ Фильтрация участника по ФИО. """
        name = request.GET.get('name', None)
        if name is None:
            return Response(
                status=HTTPStatus.OK,
                data=[]
            )
        fio = name.split()
        surname, name, patronymic = '', '', ''
        if len(fio):
            surname = fio[0]
        if surname == '':
            return Response(
                status=HTTPStatus.OK,
                data=[]
            )
        if len(fio) > 1:
            name = fio[1]
        if len(fio) > 2:
            patronymic = fio[2]
        participants = Participant.objects.filter(
            surname__startswith=surname,
            name__startswith=name,
            patronymic__startswith=patronymic
        ).all()
        results = []
        for participant in participants:
            results.append(
                {
                    'id': participant.id,
                    'name': participant.short_name(),
                    'belt': participant.belt
                }
            )
        serializer = ParticipantGroupPropertiesSerializer(
            instance=results,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class GroupViewSet(viewsets.ModelViewSet):
    """ API справочника групп аттестации. """
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer

    @action(methods=('get',), detail=False)
    def groups_tree(self, request):
        """ Дерево подгрупп с составом участников. """
        data = []
        group_id = request.GET.get('group', None)
        if group_id is None:
            groups = Group.objects.all()
        else:
            groups = Group.objects.filter(pk=group_id).all()
        for group in groups:
            properties = []
            participant_group = ParticipantGroup.objects.filter(
                group=group
            ).select_related('participant').all()
            for pg in participant_group:
                participant = pg.participant
                properties.append(
                    {
                        'id': participant.id,
                        'name': participant.short_name(),
                        'belt': participant.belt
                    }
                )
            data.append(
                {
                    'id': group.id,
                    'name': group.name,
                    'year_start': group.year_start,
                    'year_end': group.year_end,
                    'belt_start': group.belt_start,
                    'belt_end': group.belt_end,
                    'belt_attestation': group.belt_attestation,
                    'properties': properties
                }
            )
        serializer = GroupTreeSerializer(instance=data, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def fill_group(self, request):
        """ Заполняет подгруппу подходящими участниками. """
        group_id = request.data.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.filter(pk=group_id).first()
        if group is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        # Сперва очистим заполнение группы
        ParticipantGroup.objects.filter(group=group).delete()
        # Отберем подходящих участников
        participants = Participant.objects.filter(
            belt__id__gte=group.belt_start.pk,
            belt__id__lte=group.belt_end.pk,
            birth_date__year__gte=group.year_start,
            birth_date__year__lte=group.year_end,
        ).order_by('surname', 'name', 'patronymic').all()
        results = []
        for participant in participants:
            ParticipantGroup(group=group, participant=participant).save()
            results.append(
                {
                    'id': participant.id,
                    'name': participant.short_name(),
                    'belt': participant.belt
                }
            )
        serializer = ParticipantGroupPropertiesSerializer(
            instance=results,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def append_participant(self, request):
        """ Добавляет участника в группу. """
        group_id = request.data.get('group_id', None)
        participant_id = request.data.get('participant_id', None)
        if group_id is None or participant_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.filter(pk=group_id).first()
        participant = Participant.objects.filter(pk=participant_id).first()
        if group is None or participant is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        # Сперва проверим на существование
        pg = ParticipantGroup.objects.filter(
            participant=participant,
            group=group
        ).first()
        if pg is None:
            pg = ParticipantGroup(
                group=group,
                participant=participant
            )
            pg.save()
        else:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        serializer = ParticipantGroupPropertiesSerializer(
            instance={
                'id': participant.id,
                'name': participant.short_name(),
                'belt': participant.belt
            }
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def remove_participant(self, request):
        """ Открепляет участника от группы. """
        group_id = request.data.get('group_id', None)
        participant_id = request.data.get('participant_id', None)
        if group_id is None or participant_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.filter(pk=group_id).first()
        participant = Participant.objects.filter(pk=participant_id).first()
        if group is None or participant is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        ParticipantGroup.objects.filter(
            participant=participant,
            group=group
        ).all().delete()
        return Response(status=HTTPStatus.OK)


class OptionViewSet(viewsets.ModelViewSet):
    """ API справочника настроек пользователя. """
    queryset = Option.objects.all()
    serializer_class = OptionSerializer


class ComplexGroupViewSet(viewsets.ModelViewSet):
    """ API групп комплекса. """
    queryset = ComplexGroup.objects.all().order_by('name')
    serializer_class = ComplexGroupSerializer


class ComplexViewSet(viewsets.ModelViewSet):
    """ API справочника комплексов. """
    queryset = Complex.objects.all().order_by('name')
    serializer_class = ComplexSerializer

    @action(methods=('get',), detail=False)
    def complex_tree(self, request):
        """ Дерево комплексов с группами. """
        data = []
        groups = ComplexGroup.objects.all()
        for group in groups:
            complexes = []
            for complex in group.complexes.all():
                complex_info = {
                    'id': complex.id,
                    'name': complex.name,
                    'points': complex.points
                }
                complexes.append(complex_info)
            data.append(
                {
                    'id': group.id,
                    'name': group.name,
                    'properties': complexes
                }
            )
        serializer = ComplexGroupTreeSerializer(instance=data, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class BeltDemandViewSet(viewsets.ModelViewSet):
    """ API справочника требований к поясам. """
    queryset = BeltDemand.objects.all()
    serializer_class = BeltDemandSerializer

    @action(methods=('get',), detail=False)
    def used_demands(self, request):
        """ Дерево требований к поясам с отметкой использования. """
        belt_pk = request.GET.get('belt_id')
        data = []
        groups = ComplexGroup.objects.all()
        for group in groups:
            complexes = []
            for complex in group.complexes.all():
                complex_info = {
                    'id': complex.id,
                    'name': complex.name
                }
                demands = BeltDemand.objects.filter(
                    belt=belt_pk,
                    complex=complex
                )
                complex_info['used'] = True if demands.exists() else False
                complexes.append(complex_info)
            data.append(
                {
                    'id': group.id,
                    'name': group.name,
                    'properties': complexes
                }
            )
        serializer = BeltDemandUsedSerializer(instance=data, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('delete',), detail=False)
    def remove_demand(self, request):
        """ Удаляет требования к поясу. """
        belt_pk = request.GET.get('belt_id')
        complex_pk = request.GET.get('complex_id')
        if belt_pk is None or complex_pk is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST,
                data='belt or complex not found'
            )
        belt_demand = BeltDemand.objects.filter(
            belt=belt_pk, complex=complex_pk
        )
        if not belt_demand.exists():
            return Response(
                status=HTTPStatus.BAD_REQUEST,
                data='belt demand not found'
            )
        belt_demand.delete()
        return Response(
            status=HTTPStatus.OK,
        )


class AttestationViewSet(viewsets.ModelViewSet):
    """ API данных аттестации. """
    queryset = Attestation.objects.all()
    serializer_class = AttestationSerializer

    @action(methods=('get',), detail=False)
    def change_complex_group(self, request):
        """ Возвращает список комплексов и выставленных баллов. """
        participant_id = request.GET.get('participant', None)
        complex_group_id = request.GET.get('complex_group', None)
        group_id = request.GET.get('group_id', None)
        if (
            participant_id is None or
            complex_group_id is None or
            group_id is None
        ):
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        # participant = Participant.objects.get(pk=participant_id)
        group = Group.objects.get(pk=group_id)
        demand_complexes = set(BeltDemand.objects.filter(
            belt=group.belt_attestation
        ).all().values_list('complex', flat=True))
        complexes = Complex.objects.filter(
            complex_group=complex_group_id,
            pk__in=demand_complexes
        ).all()
        data = []
        judge = request.user
        for complex in complexes:
            attestation = complex.attestations.filter(
                participant_id=participant_id,
                judge=judge
            ).first()
            if attestation is None:
                data.append(
                    {
                        'id': complex.id,
                        'name': complex.name,
                        'points': 0,
                        'max': complex.points
                    }
                )
            else:
                data.append(
                    {
                        'id': complex.id,
                        'name': complex.name,
                        'points': attestation.points,
                        'max': complex.points
                    }
                )
        serializer = AttestationComplexSerializer(instance=data, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def set_points(self, request):
        """ Устанавливаем баллы за комплекс. """
        participant_id = request.data.get('participant', None)
        complex_id = request.data.get('complex', None)
        points = int(request.data.get('points', 0))
        if participant_id is None or complex_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        judge = request.user
        Attestation.objects.update_or_create(
            participant_id=participant_id,
            complex_id=complex_id,
            judge=judge,
            defaults={'points': points}
        )
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('post',), detail=False)
    def restart_attestation(self, request):
        """ Перезапуск аттестации. """
        group_id = request.data.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        pgs = ParticipantGroup.objects.filter(group=group_id).all()
        for pg in pgs:
            Attestation.objects.filter(participant=pg.participant).delete()
        group = Group.objects.get(pk=group_id)
        group.status = 'Ожидание'
        group.save()
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('get',), detail=False)
    def complete_attestation(self, request):
        """ Завершает аттестацию подгруппы. """
        group_id = request.GET.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        group.status = 'Завершено'
        group.save()
        return Response(
            status=HTTPStatus.OK
        )


class ParticipantGroupViewSet(viewsets.ModelViewSet):
    """ API состава групп. """
    queryset = ParticipantGroup.objects.all().order_by('order')
    serializer_class = ParticipantGroupSerializer
