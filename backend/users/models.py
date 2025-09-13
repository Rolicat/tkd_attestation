from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_judging = models.BooleanField(
        verbose_name='Аттестует',
        help_text='Аттестует',
        blank=False,
        null=False,
        default=False
    )
