from http import HTTPStatus
from csv import reader
import os
import zipfile

from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

from attestation.models import (
    Belt, Participant, Group, Option,
    ComplexGroup, Complex, BeltDemand,
    Attestation, ParticipantGroup,
    PhysicalTest, AdditionalTest,
    AdditionalTestCriteria, AdditionalTestDemand,
    PhysicalTestDemand, PhysicalTestPoint,
    PhysicalAttestation, AdditionalAttestation,
    AttestationInfo, AgePeriod
)

from api.serializers import (
    BeltSerializer, ParticipantSerializer,
    GroupSerializer, OptionSerializer,
    ComplexGroupSerializer, ComplexSerializer,
    BeltDemandSerializer, AttestationSerializer,
    BeltDemandUsedSerializer, ComplexGroupTreeSerializer,
    GroupTreeSerializer, ParticipantGroupPropertiesSerializer,
    ParticipantGroupSerializer, AttestationComplexSerializer,
    AttestationResultSerializer, PhysicalTestSerializer,
    AdditionalTestSerializer, AdditionalTestCriteriaSerializer,
    TestTreeSerializer, AdditionalTestDemandUsedSerializer,
    AdditionalTestDemandSerializer, PhysicalTestDemandSerializer,
    PhysicalTestPointSerializer, PhysicalAttestationSerializer,
    DemandsByGroupAndTestSerializer, AdditionalAttestationSerializer,
    AttestationInfoSerializer, AgePeriodSerializer, CustomUserSerializer
)

from api.helpers import calc_attestation_points


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = (AllowAny, )
    authentication_classes = (BasicAuthentication, JWTAuthentication)

    @action(methods=('get',), detail=False)
    def me(self, request):
        """"""
        serializer = CustomUserSerializer(instance=request.user)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class BeltViewSet(viewsets.ModelViewSet):
    """ API справочника поясов. """
    queryset = Belt.objects.all().order_by('id')
    serializer_class = BeltSerializer


class AgePeriodViewSet(viewsets.ModelViewSet):
    """ API справочника возрастов. """
    queryset = AgePeriod.objects.all().order_by('age_from')
    serializer_class = AgePeriodSerializer


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
    permission_classes = (IsAuthenticatedOrReadOnly, )

    @action(methods=('patch',), detail=False)
    def save_by_name(self, request):
        """ Сохраняет настройку по имени. """
        name = request.data.get('name', None)
        value = request.data.get('value', None)
        if name is None or value is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        option = Option.objects.filter(name=name).first()
        if option is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        option.value = value
        option.save()
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('post',), detail=False)
    def preload_complexes(self, request):
        """ Загрузка данных комлексов. """
        AttestationInfo.objects.all().delete()
        Attestation.objects.all().delete()
        BeltDemand.objects.all().delete()
        Complex.objects.all().delete()
        ComplexGroup.objects.all().delete()
        file = request.data['file']
        file_path = os.path.join(settings.TEMPLATE_ROOT, 'tmp.csv')
        with open(file_path, 'wb') as csvfile:
            csvfile.write(file.read())
        with open(file_path, 'r') as csvfile:
            csv_reader = reader(csvfile, delimiter=';')
            cg = ComplexGroup()
            for row in csv_reader:
                if row[0] == '':
                    cg = ComplexGroup(name=row[1])
                    cg.save()
                else:
                    complex = Complex(
                        name=row[1],
                        complex_group=cg
                    )
                    complex.save()
        os.remove(file_path)
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('post',), detail=False)
    def upgrade_program(self, request):
        """ Загрузка данных комлексов. """
        file = request.data['file']
        file_path = os.path.join(settings.TEMPLATE_ROOT, 'update.zip')
        with open(file_path, 'wb') as archive_file:
            archive_file.write(file.read())
        if zipfile.is_zipfile(file_path):
            z_file = zipfile.ZipFile(file_path, 'r')
            z_file.extractall(settings.BASE_DIR.parent)
            z_file.close()
        os.remove(file_path)
        return Response(
            status=HTTPStatus.OK
        )


class ComplexGroupViewSet(viewsets.ModelViewSet):
    """ API групп комплекса. """
    queryset = ComplexGroup.objects.all().order_by('id')
    serializer_class = ComplexGroupSerializer

    @action(methods=('post', ), detail=False)
    def complex_groups_by_group(self, request):
        """ Получить группы комплексов по требованиям подгуппы. """
        group_id = request.data.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        belt = group.belt_attestation
        belt_demands = BeltDemand.objects.filter(
            belt=belt
        ).all()
        complex_groups = []
        for row in belt_demands:
            if row.complex.complex_group not in complex_groups:
                complex_groups.append(row.complex.complex_group)
        serializer = ComplexGroupSerializer(instance=complex_groups, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def complexes(self, request):
        """ Получить комплексы группы. """
        group_id = request.data.get('group_id', None)
        complexGroup_id = request.data.get('complexGroup_id', None)
        if group_id is None or complexGroup_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        belt = group.belt_attestation
        complexGroup = ComplexGroup.objects.get(pk=complexGroup_id)
        belt_demands = BeltDemand.objects.filter(
            belt=belt,
            complex__in=complexGroup.complexes.all(),
        ).all()
        complexes = []
        for bd in belt_demands:
            complexes.append(bd.complex)
        serializer = ComplexSerializer(
            instance=complexes,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


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
    def complex_point(self, request):
        """ Возвращает текущие баллы за комплекс. """
        participant_id = request.GET.get('participant', None)
        complex_id = request.GET.get('complex_id', None)
        group_id = request.GET.get('group_id', None)
        if (
            participant_id is None or
            complex_id is None or
            group_id is None
        ):
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        judge = request.user
        complex = Complex.objects.get(pk=complex_id)
        attestation = Attestation.objects.filter(
            participant=participant_id,
            complex=complex_id,
            judge=judge
        ).first()
        if attestation is None:
            data = {
                'id': complex.id,
                'name': complex.name,
                'points': 0,
                'max': complex.points
            }
        else:
            data = {
                'id': complex.id,
                'name': complex.name,
                'points': attestation.points,
                'max': complex.points
            }
        serializer = AttestationComplexSerializer(instance=data)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('get',), detail=False)
    def physical_test_point(self, request):
        """ Возвращает текущие баллы за физический комплекс. """
        participant_id = request.GET.get('participant_id', None)
        test_id = request.GET.get('test_id', None)
        if (
            participant_id is None or
            test_id is None
        ):
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        test = PhysicalTest.objects.get(pk=test_id)
        physical_attestation = PhysicalAttestation.objects.filter(
            participant=participant_id,
            test=test_id
        ).first()
        if physical_attestation is None:
            data = {
                'id': test.id,
                'name': test.name,
                'points': 0,
                'max': 9999
            }
        else:
            data = {
                'id': test.id,
                'name': test.name,
                'points': physical_attestation.points,
                'max': 9999
            }
        serializer = PhysicalAttestationSerializer(instance=data)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('get',), detail=False)
    def additional_test_point(self, request):
        """ Возвращает текущие баллы за дополнительный комплекс. """
        participant_id = request.GET.get('participant_id', None)
        test_id = request.GET.get('test_id', None)
        if (
            participant_id is None or
            test_id is None
        ):
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        test = AdditionalTest.objects.get(pk=test_id)
        additional_attestation = AdditionalAttestation.objects.filter(
            participant_id=participant_id,
            test=test
        ).first()
        if additional_attestation is None:
            data = {
                'name': '',
            }
        else:
            data = {
                'name': additional_attestation.criteria.name,
            }
        serializer = AdditionalAttestationSerializer(instance=data)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

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
        if group.status == 'Завершено':
            return Response(
                status=HTTPStatus.OK,
                data=[]
            )
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
        p_group = ParticipantGroup.objects.filter(
            participant__id=participant_id
        ).first()
        if p_group is None or p_group.group.status != 'В процессе':
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        complex_id = request.data.get('complex', None)
        points = float(request.data.get('points', 0))
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
    def set_physical_test_points(self, request):
        """ Устанавливаем баллы за физический комплекс. """
        participant_id = request.data.get('participant_id', None)
        p_group = ParticipantGroup.objects.filter(
            participant__id=participant_id
        ).first()
        if p_group is None or p_group.group.status != 'В процессе':
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        test_id = request.data.get('test_id', None)
        points = float(request.data.get('points', 0))
        if participant_id is None or test_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        PhysicalAttestation.objects.update_or_create(
            participant_id=participant_id,
            test_id=test_id,
            defaults={'points': points}
        )
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('post',), detail=False)
    def set_additional_test_points(self, request):
        """ Устанавливаем баллы за дополнительный комплекс. """
        participant_id = request.data.get('participant_id', None)
        p_group = ParticipantGroup.objects.filter(
            participant__id=participant_id
        ).first()
        if p_group is None or p_group.group.status != 'В процессе':
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        test_id = request.data.get('test_id', None)
        criteria_id = float(request.data.get('criteria_id', None))
        if participant_id is None or test_id is None or criteria_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        AdditionalAttestation.objects.update_or_create(
            participant_id=participant_id,
            test_id=test_id,
            defaults={'criteria_id': criteria_id}
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
            PhysicalAttestation.objects.filter(
                participant=pg.participant
            ).delete()
            AdditionalAttestation.objects.filter(
                participant=pg.participant
            ).delete()
        AttestationInfo.objects.filter(group=group_id).delete()
        group = Group.objects.get(pk=group_id)
        group.status = 'Ожидание'
        group.save()
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('get', ), detail=False)
    def restart_all_attestation(self, request):
        """ Перезапуск аттестации всех подгрупп. """
        pgs = ParticipantGroup.objects.filter().all()
        for pg in pgs:
            Attestation.objects.filter(participant=pg.participant).delete()
            PhysicalAttestation.objects.filter(
                participant=pg.participant
            ).delete()
            AdditionalAttestation.objects.filter(
                participant=pg.participant
            ).delete()
        groups = Group.objects.all()
        AttestationInfo.objects.all().delete()
        for group in groups:
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

    @action(methods=('get',), detail=False)
    def results(self, request):
        """ Возвращает результаты подгруппы. """
        group_id = request.GET.get('group_id', None)
        option = Option.objects.filter(name='points_calc').first()
        if group_id is None or option is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        data = calc_attestation_points(
            group_id=group_id,
            option=option
        )
        serializer = AttestationResultSerializer(instance=data, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class AttestationInfoViewSet(viewsets.ModelViewSet):
    """ API информации об аттестации. """
    queryset = AttestationInfo.objects.all()
    serializer_class = AttestationInfoSerializer

    @action(methods=('get',), detail=False)
    def get_info_by_group(self, request):
        """ Получить информацию по аттестации подгруппы. """
        group_id = request.GET.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        info = AttestationInfo.objects.filter(group_id=group_id).first()
        if info is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        serializer = AttestationInfoSerializer(instance=info)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def set_info_by_group(self, request):
        """ Установить информацию по аттестации подгруппы. """
        group_id = request.data.get('group_id', None)
        complex_group_id = request.data.get('complex_group_id', None)
        complex_id = request.data.get('complex_id', None)
        if group_id is None or complex_group_id is None or complex_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        complex_group = ComplexGroup.objects.get(pk=complex_group_id)
        complex = Complex.objects.get(pk=complex_id)
        AttestationInfo.objects.update_or_create(
            group=group,
            defaults={
                'complex_group': complex_group,
                'complex': complex
            }
        )
        return Response(
            status=HTTPStatus.OK
        )


class ParticipantGroupViewSet(viewsets.ModelViewSet):
    """ API состава групп. """
    queryset = ParticipantGroup.objects.all().order_by('order')
    serializer_class = ParticipantGroupSerializer


class PhysicalTestViewSet(viewsets.ModelViewSet):
    """ API физических комплексов. """
    queryset = PhysicalTest.objects.all()
    serializer_class = PhysicalTestSerializer

    @action(methods=('post',), detail=False)
    def tests(self, request):
        """ Получить физические комплексы группы. """
        group_id = request.data.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        belt = group.belt_attestation
        belt_demands = PhysicalTestDemand.objects.filter(
            belt=belt
        ).values_list('test', flat=True).distinct().all()
        tests = []
        for pbd in belt_demands:
            tests.append(PhysicalTest.objects.get(pk=pbd))
        serializer = PhysicalTestSerializer(
            instance=tests,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class AdditionalTestViewSet(viewsets.ModelViewSet):
    """ API дополнительных комплексов. """
    queryset = AdditionalTest.objects.all()
    serializer_class = AdditionalTestSerializer

    @action(methods=('post',), detail=False)
    def criterias(self, request):
        """ Получить дополнительные комплексы группы. """
        group_id = request.data.get('group_id', None)
        if group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        belt = group.belt_attestation
        belt_demands = AdditionalTestDemand.objects.filter(
            belt=belt
        ).values('criteria__additional_test').all()
        tests_ids = []
        for pbd in belt_demands:
            if pbd['criteria__additional_test'] not in tests_ids:
                tests_ids.append(pbd['criteria__additional_test'])
        tests = AdditionalTest.objects.filter(pk__in=tests_ids).all()
        serializer = AdditionalTestSerializer(
            instance=tests,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class AdditionalTestCriteriaViewSet(viewsets.ModelViewSet):
    """ API критериев дополнительных комплексов. """
    queryset = AdditionalTestCriteria.objects.all()
    serializer_class = AdditionalTestCriteriaSerializer

    @action(methods=('get',), detail=False)
    def criteria_tree(self, request):
        """ Дерево комплексов с группами. """
        data = []
        tests = AdditionalTest.objects.all()
        for test in tests:
            criterias = []
            for criteria in test.criterias.all():
                criteria_info = {
                    'id': criteria.id,
                    'name': criteria.name,
                    'points': criteria.points
                }
                criterias.append(criteria_info)
            data.append(
                {
                    'id': test.id,
                    'name': test.name,
                    'properties': criterias
                }
            )
        serializer = TestTreeSerializer(instance=data, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('get',), detail=False)
    def criteria_by_test(self, request):
        """ Список критериев по тесту. """
        test_id = request.GET.get('test_id', None)
        group_id = request.GET.get('group_id', None)
        if test_id is None or group_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        belt = group.belt_attestation
        atds = AdditionalTestDemand.objects.filter(
            belt=belt
        ).all()
        criterias = AdditionalTestCriteria.objects.filter(
            additional_test_id=test_id,
            pk__in=[_.criteria.id for _ in atds]
        ).all()
        serializer = AdditionalTestCriteriaSerializer(
            instance=criterias,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class AdditionalTestDemandViewSet(viewsets.ModelViewSet):
    """ API требований дополнительных комплексов. """
    queryset = AdditionalTestDemand.objects.all()
    serializer_class = AdditionalTestDemandSerializer

    @action(methods=('get',), detail=False)
    def used_demands(self, request):
        """ Дерево требований к поясам с отметкой использования. """
        belt_pk = request.GET.get('belt_id')
        data = []
        tests = AdditionalTest.objects.all()
        for test in tests:
            criterias = []
            for criteria in test.criterias.all():
                criteria_info = {
                    'id': criteria.id,
                    'name': criteria.name
                }
                demands = AdditionalTestDemand.objects.filter(
                    belt=belt_pk,
                    criteria=criteria
                )
                criteria_info['used'] = True if demands.exists() else False
                criterias.append(criteria_info)
            data.append(
                {
                    'id': test.id,
                    'name': test.name,
                    'properties': criterias
                }
            )
        serializer = AdditionalTestDemandUsedSerializer(
            instance=data, many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('delete',), detail=False)
    def remove_criteria(self, request):
        """ Удаляет требования дополнительного теста к поясу. """
        belt_pk = request.GET.get('belt_id')
        criteria_pk = request.GET.get('criteria_id')
        if belt_pk is None or criteria_pk is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST,
                data='belt or criteria not found'
            )
        belt_demand = AdditionalTestDemand.objects.filter(
            belt=belt_pk, criteria=criteria_pk
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


class PhysicalTestDemandViewSet(viewsets.ModelViewSet):
    """ API требований физических комплексов. """
    queryset = PhysicalTestDemand.objects.all()
    serializer_class = PhysicalTestDemandSerializer

    @action(methods=('get',), detail=False)
    def belt_demands(self, request):
        """ Требования по поясу. """
        belt_pk = request.GET.get('belt_id', None)
        age_period_pk = request.GET.get('age_period_id', None)
        if belt_pk is None or age_period_pk is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        belt = Belt.objects.get(pk=belt_pk)
        age_period = AgePeriod.objects.get(pk=age_period_pk)
        tests = PhysicalTest.objects.all()
        results = []
        for test in tests:
            demand = PhysicalTestDemand.objects.filter(
                belt=belt_pk,
                age_period=age_period,
                test=test
            ).first()
            result = {}
            result['test'] = {
                'id': test.id,
                'name': test.name,
            }
            result['belt'] = belt
            result['age_period'] = age_period
            if demand is None:
                result['criteria_male'] = 0
                result['criteria_female'] = 0
            else:
                result['criteria_male'] = demand.criteria_female
                result['criteria_female'] = demand.criteria_male
            results.append(result)
        serializer = PhysicalTestDemandSerializer(instance=results, many=True)
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )

    @action(methods=('post',), detail=False)
    def save_criteria(self, request):
        """ Сохранить  критерии. """
        test_pk = request.data.get('test_id', None)
        belt_pk = request.data.get('belt_id', None)
        age_period_pk = request.data.get('age_period_id', None)
        criteriaMale = request.data.get('criteriaMale', None)
        criteriaFemale = request.data.get('criteriaFemale', None)
        if (
            test_pk is None or
            belt_pk is None or
            criteriaMale is None or
            criteriaFemale is None or
            age_period_pk is None
        ):
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        test = PhysicalTest.objects.get(pk=test_pk)
        belt = Belt.objects.get(pk=belt_pk)
        age_period = AgePeriod.objects.get(pk=age_period_pk)
        ptd = PhysicalTestDemand.objects.filter(
            test=test,
            belt=belt,
            age_period=age_period
        ).first()
        if ptd is None:
            ptd = PhysicalTestDemand(
                test=test,
                belt=belt,
                age_period=age_period
            )
        ptd.criteria_male = criteriaMale
        ptd.criteria_female = criteriaFemale
        ptd.save()
        return Response(
            status=HTTPStatus.OK
        )

    @action(methods=('get',), detail=False)
    def demands_by_group_test(self, request):
        """ Требования по поясу и виду комплекса. """
        group_id = request.GET.get('group_id', None)
        test_id = request.GET.get('test_id', None)
        if group_id is None or test_id is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        group = Group.objects.get(pk=group_id)
        belt = group.belt_attestation
        ptd = PhysicalTestDemand.objects.filter(
            test_id=test_id,
            belt=belt
        ).first()
        if ptd is None:
            return Response(
                status=HTTPStatus.BAD_REQUEST
            )
        criteria_male = ptd.criteria_male
        criteria_female = ptd.criteria_female
        percents_and_points = PhysicalTestPoint.objects.order_by(
            '-points'
        ).all()
        results = []
        for _ in percents_and_points:
            results.append(
                {
                    'points': _.points,
                    'criteria_male': round(criteria_male*_.percent/100, 0),
                    'criteria_female': round(criteria_female*_.percent/100, 0)
                }
            )
        serializer = DemandsByGroupAndTestSerializer(
            instance=results,
            many=True
        )
        return Response(
            status=HTTPStatus.OK,
            data=serializer.data
        )


class PhysicalTestPointViewSet(viewsets.ModelViewSet):
    """ API критериев процентажа для физических тестов. """
    queryset = PhysicalTestPoint.objects.order_by('points').all()
    serializer_class = PhysicalTestPointSerializer
