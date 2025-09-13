from django.core.management.base import BaseCommand

from attestation.models import Belt


class Command(BaseCommand):
    """Первоначальное заполнение БД."""
    help = 'program initialization'

    def handle(self, *args, **options):
        """Точка входа."""
        self.init_belt_table()

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
