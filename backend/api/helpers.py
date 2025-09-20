from django.db.models import Sum

from attestation.models import (
    Option, Group, BeltDemand, Attestation,
    Participant
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
    b_demands = BeltDemand.objects.filter(
        belt=group.belt_attestation
    ).all()
    complexes = [b_demand.complex for b_demand in b_demands]
    points = sum([complex.points for complex in complexes])
    judges_count = Attestation.objects.filter(
        complex__in=complexes
    ).values('judge').distinct().count()
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
                    attestation['points__sum'] / judges_count
                )
            else:
                results[id] = {
                    'name': name,
                    'point': attestation['points__sum'] / judges_count
                }
    data = []
    for id, info in results.items():
        percent = round(info['point'] * 100 / points, 2)
        data.append(
            {
                'id': id,
                'value': (
                    f'{info['name']}: '
                    f'{info['point']} из {points} '
                    f'({percent} %)'
                )
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
                    f'{info['name']}: '
                    f'{info['point']} из {points} '
                    f'({percent} %)'
                )
            }
        )
    return data
