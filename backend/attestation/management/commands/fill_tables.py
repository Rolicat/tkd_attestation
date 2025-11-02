from django.core.management.base import BaseCommand

from attestation.models import Belt, Option, PhysicalTestPoint


class Command(BaseCommand):
    """Первоначальное заполнение БД."""
    help = 'program initialization'

    def handle(self, *args, **options):
        """Точка входа."""
        self.init_belt_table()
        self.init_options_table()
        self.init_physical_test_points()
        print('done')

    def init_belt_table(self):
        """ Заполняет справочник поясов. """
        belts_names = (
            'белый',
            'бело-жёлтый',
            'жёлтый',
            'жёлто-зеленый',
            'зеленый',
            'зелено-синий',
            'синий',
            'сине-красный',
            'красный',
            'красно-черный',
            'черный',
        )
        belts = Belt.objects.all()
        if len(belts):
            return
        for name in belts_names:
            belt = Belt(name=name)
            belt.save()

    def init_options_table(self):
        """ Инициализация опций. """
        options_names = (
            'participants_in_row',
            'who_finished_attestation',
            'registration_allowed'
        )
        for name in options_names:
            option = Option.objects.filter(name=name).first()
            if option is None:
                Option(name=name).save()

    def init_physical_test_points(self):
        """ Заполняет таблицу баллов по физическим тестам. """
        percent = 0
        for i in range(1, 6):
            test_points = PhysicalTestPoint.objects.filter(points=i).first()
            if test_points is not None:
                continue
            test_points = PhysicalTestPoint(
                points=i,
                percent=percent,
            )
            test_points.save()
            percent += 25
