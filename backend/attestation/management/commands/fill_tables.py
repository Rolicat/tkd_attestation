from django.core.management.base import BaseCommand

from attestation.models import Belt, Option


class Command(BaseCommand):
    """Первоначальное заполнение БД."""
    help = 'program initialization'

    def handle(self, *args, **options):
        """Точка входа."""
        self.init_belt_table()
        self.init_options_table()

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
            'points_calc',
            'who_finished_attestation'
        )
        for name in options_names:
            option = Option.objects.filter(name=name).first()
            if option is None:
                Option(name=name).save()
