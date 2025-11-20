from django.db.models import Sum

from attestation.models import (
    Option, Group, BeltDemand, Attestation,
    Participant, PhysicalAttestation, PhysicalTestDemand,
    PhysicalTestPoint, Belt, PhysicalTest,
    AdditionalAttestation, AdditionalTest,
    ParticipantGroup
)


def calc_attestation_points(
        group_id: str,
        option: Option
) -> list[dict[int, str]]:
    """ Рассчитывает полученные баллы за аттестацию. """
    match option.value:
        case '0':
            results = calc_average_points(group_id=group_id)
        case '1':
            results = calc_common_points(group_id=group_id)
        case _:
            results = calc_average_points(group_id=group_id)
    return results


def calc_average_points(group_id: str) -> list[dict[int, str]]:
    """ Рассчитывает полученные баллы за аттестацию по среднему. """
    group = Group.objects.filter(pk=group_id).first()
    if group is None:
        return []
    p_gs = ParticipantGroup.objects.filter(group=group).all()
    participants = [p_g.participant for p_g in p_gs]
    b_demands = BeltDemand.objects.filter(
        belt=group.belt_attestation
    ).all()
    complex_info = {}
    for b_demand in b_demands:
        if b_demand.complex.complex_group in complex_info:
            complex_info[b_demand.complex.complex_group].append(
                b_demand.complex
            )
        else:
            complex_info[b_demand.complex.complex_group] = [b_demand.complex]
    results = {}
    for complex_group, complexes in complex_info.items():
        judges_count = Attestation.objects.filter(
            complex__in=complexes,
            participant__in=participants
        ).values('judge').distinct().count()
        attestations = Attestation.objects.filter(
            complex__in=complexes,
            participant__in=participants
        ).values('participant').annotate(
            Sum('points')
        ).all()
        for attestation in attestations:
            id = attestation['participant']
            name = Participant.objects.get(
                pk=id
            ).short_name()
            calced_points = round(
                attestation['points__sum'] / len(complexes) / judges_count,
                2
            )
            if id in results:
                results[id]['complexes'].append(
                    {
                        'name': complex_group.name,
                        'point': calced_points
                    }
                )
            else:
                results[id] = {
                    'name': name,
                    'complexes': [{
                        'name': complex_group.name,
                        'point': calced_points
                    }],
                }
    physical_attestations = PhysicalAttestation.objects.filter(
        participant__in=participants
    ).all()
    physical_complexes_demands = PhysicalTestDemand.objects.filter(
        belt=group.belt_attestation
    ).all()
    tests = [p_c_d.test for p_c_d in physical_complexes_demands]
    common_points = {}
    for attestation in physical_attestations:
        id = attestation.participant.id
        calced_points = calc_physical_points(
            points=attestation.points,
            test=attestation.test,
            belt=group.belt_attestation
        )
        if id in common_points:
            common_points[id] += calced_points
        else:
            common_points[id] = calced_points
    data = []
    for id, calced_points in common_points.items():
        name = Participant.objects.get(
            pk=id
        ).short_name()
        points = round(calced_points / len(tests), 2)
        if id in results:
            results[id]['complexes'].append(
                {
                    'name': 'ОФП',
                    'point': points
                }
            )
        else:
            results[id] = {
                'name': name,
                'complexes': [{
                    'name': 'ОФП',
                    'point': points
                }],
            }
    attestations = AdditionalAttestation.objects.filter(
        participant__in=participants
    ).values(
        'participant', 'test'
    ).annotate(Sum('criteria__points')).all()
    for attestation in attestations:
        id = attestation['participant']
        name = Participant.objects.get(
            pk=id
        ).short_name()
        test = AdditionalTest.objects.get(pk=attestation['test'])
        calced_points = attestation['criteria__points__sum']
        if id in results:
            results[id]['complexes'].append(
                {
                    'name': test.name,
                    'point': calced_points
                }
            )
        else:
            results[id] = {
                'name': name,
                'complexes': [{
                    'name': test.name,
                    'point': calced_points
                }],
            }
    for id, info in results.items():
        data.append(
            {
                'id': id,
                'value': info['name'],
                'complexes': info['complexes']
            }
        )
    return data


def calc_common_points(group_id: str) -> list[dict[int, str]]:
    """ Рассчитывает полученные баллы за аттестацию по общему. """
    group = Group.objects.filter(pk=group_id).first()
    if group is None:
        return []
    b_demands = BeltDemand.objects.filter(
        belt=group.belt_attestation
    ).all()
    complexes = [b_demand.complex for b_demand in b_demands]
    judges_count = Attestation.objects.filter(
        complex__in=complexes
    ).values('judge').distinct().count()
    points = sum([complex.points for complex in complexes]) * judges_count
    results = {}
    for complex in complexes:
        attestations = Attestation.objects.filter(
            complex=complex
        ).values('participant').annotate(
            Sum('points')
        ).all()
        for attestation in attestations:
            id = attestation['participant']
            name = Participant.objects.get(
                pk=id
            ).short_name()
            if id in results:
                results[id]['point'] += (
                    attestation['points__sum']
                )
            else:
                results[id] = {
                    'name': name,
                    'point': attestation['points__sum']
                }
    data = []
    for id, info in results.items():
        percent = round(info['point'] * 100 / points, 2)
        data.append(
            {
                'id': id,
                'value': (
                    f'{info["name"]}: '
                    f'{info["point"]} из {points} '
                    f'({percent} %)'
                )
            }
        )
    return data


def calc_physical_points(test: PhysicalTest, points: int, belt: Belt) -> int:
    """ Рассчитывает оценку на основании выполненного критерия. """
    print(f'{test=} {points=} {belt=}')
    test_demand = PhysicalTestDemand.objects.filter(
        test=test,
        belt=belt
    ).first()
    if test_demand is None:
        return 0
    max_points = test_demand.criteria
    points_percent = round(min(points, max_points) * 100 / max_points, 2)
    print(f'{points_percent=}')
    test_points = PhysicalTestPoint.objects.filter(
        percent__gte=points_percent
    ).order_by('percent').first()
    if test_points is None:
        return 0
    return test_points.points
