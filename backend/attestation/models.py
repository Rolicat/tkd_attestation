from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Belt(models.Model):
    """ Справочник поясов. """
    name = models.CharField(
        verbose_name='Пояс',
        help_text='Пояс',
        max_length=50,
        blank=False,
        null=False
    )

    def __str__(self):
        return self.name


class Participant(models.Model):
    """ Справочник участников. """
    surname = models.CharField(
        verbose_name='Фамилия',
        help_text='Фамилия',
        max_length=50,
        blank=False,
        null=False
    )
    name = models.CharField(
        verbose_name='Имя',
        help_text='Имя',
        max_length=30,
        blank=False,
        null=False
    )
    patronymic = models.CharField(
        verbose_name='Отчество',
        help_text='Отчество',
        max_length=50,
        blank=False,
        null=False
    )
    birth_date = models.DateField(
        verbose_name='Дата рождения',
        help_text='Дата рождения',
        blank=False,
        null=False
    )
    belt = models.ForeignKey(
        to=Belt,
        verbose_name='Пояс',
        help_text='Пояс',
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        related_name='participants'
    )

    def short_name(self):
        """ Возвращает ФИО формата Фамилия И.О. """
        surname = self.surname
        name = self.name[0]+'.' if len(self.name) else ''
        patronymic = self.patronymic[0]+'.' if len(self.patronymic) else ''
        return f'{surname} {name} {patronymic}'

    def __str__(self):
        return (
            f'{self.surname} {self.name} {self.patronymic}. '
            f'Пояс: {self.belt}'
        )


class Group(models.Model):
    """ Справочник групп. """
    name = models.CharField(
        verbose_name='Наименование',
        help_text='Наименование',
        max_length=100,
        blank=False,
        null=False
    )
    year_start = models.SmallIntegerField(
        verbose_name='Год рождения начальный',
        help_text='Год рождения начальный',
        blank=False,
        null=False
    )
    year_end = models.SmallIntegerField(
        verbose_name='Год рождения конечный',
        help_text='Год рождения конечный',
        blank=False,
        null=False
    )
    belt_start = models.ForeignKey(
        to=Belt,
        verbose_name='Пояс начальный',
        help_text='Пояс начальный',
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        related_name='+'
    )
    belt_end = models.ForeignKey(
        to=Belt,
        verbose_name='Пояс конечный',
        help_text='Пояс конечный',
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        related_name='+'
    )
    belt_attestation = models.ForeignKey(
        to=Belt,
        verbose_name='Пояс аттестационный',
        help_text='Пояс аттестационный',
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        related_name='+'
    )
    status = models.CharField(
        verbose_name='Статус аттестации',
        help_text='Статус аттестации',
        max_length=30,
        blank=False,
        null=False,
        default='Ожидание'
    )

    def __str__(self):
        return f'Группа: {self.name}'


class ParticipantGroup(models.Model):
    """ Таблица связи участников и групп. """
    participant = models.ForeignKey(
        to=Participant,
        verbose_name='Участник',
        help_text='Участник',
        blank=False,
        null=False,
        related_name='participant_group',
        on_delete=models.CASCADE
    )
    group = models.ForeignKey(
        to=Group,
        verbose_name='Группа',
        help_text='Группа',
        blank=False,
        null=False,
        related_name='participants',
        on_delete=models.CASCADE
    )
    order = models.SmallIntegerField(
        verbose_name='Порядок участников',
        help_text='Порядок участников',
        blank=False,
        null=False,
        default=1
    )

    def __str__(self):
        return f'{self.group}: {self.participant}'


class Option(models.Model):
    """ Справочник настроек. """
    name = models.CharField(
        verbose_name='Наименование',
        help_text='Наименование',
        max_length=100,
        blank=False,
        null=False
    )
    value = models.CharField(
        verbose_name='Значение',
        help_text='Значение',
        max_length=100,
        blank=False,
        null=False
    )
    user = models.ForeignKey(
        to=User,
        verbose_name='Пользователь',
        help_text='Пользователь',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name='options'
    )


class ComplexGroup(models.Model):
    """ Справочник групп комплексов. """
    name = models.CharField(
        verbose_name='Наименование',
        help_text='Наименование',
        max_length=100,
        blank=False,
        null=False
    )

    def __str__(self):
        return self.name


class Complex(models.Model):
    """ Справочник комплексов. """
    name = models.CharField(
        verbose_name='Наименование',
        help_text='Наименование',
        max_length=100,
        blank=False,
        null=False
    )
    complex_group = models.ForeignKey(
        to=ComplexGroup,
        verbose_name='Группа комплекса',
        help_text='Группа комплекса',
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name='complexes'
    )
    points = models.SmallIntegerField(
        verbose_name='Балл',
        help_text='Балл',
        blank=False,
        null=False,
        default=0
    )

    def __str__(self):
        return f'{self.name}. Макс. баллы: {self.points}'


class BeltDemand(models.Model):
    """ Справочник требований к поясам. """
    belt = models.ForeignKey(
        to=Belt,
        verbose_name='Пояс',
        help_text='Пояс',
        blank=False,
        null=False,
        on_delete=models.CASCADE
    )
    complex = models.ForeignKey(
        to=Complex,
        verbose_name='Комплекс',
        help_text='Комплекс',
        blank=False,
        null=False,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'Пояс: {self.belt}. Комплекс: {self.complex}'


class Attestation(models.Model):
    """ Данные по аттестации участников. """
    participant = models.ForeignKey(
        to=Participant,
        verbose_name='Участник',
        help_text='Участник',
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name='attestations'
    )
    complex = models.ForeignKey(
        to=Complex,
        verbose_name='Комплекс',
        help_text='Комплекс',
        blank=False,
        null=False,
        on_delete=models.CASCADE,
        related_name='attestations'
    )
    points = models.SmallIntegerField(
        verbose_name='Балл',
        help_text='Балл',
        blank=False,
        null=False
    )
    judge = models.ForeignKey(
        to=User,
        verbose_name='Судья',
        help_text='Судья',
        blank=False,
        null=False,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return (
            f'{self.participant} ('
            f'{self.complex} {self.points} '
            f'{self.judge})'
        )
