from rest_framework import serializers

from attestation.models import (
    Belt, Participant, Group, Option,
    ComplexGroup, Complex, BeltDemand,
    Attestation, ParticipantGroup
)


class BeltSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника поясов. """
    class Meta:
        model = Belt
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника участников. """

    class Meta:
        model = Participant
        fields = '__all__'


class ParticipantGroupPropertiesSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника участников. """
    belt = serializers.CharField(source='belt.name')

    class Meta:
        model = Participant
        fields = ('id', 'name', 'belt')


class GroupSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника групп аттестации. """

    class Meta:
        model = Group
        fields = '__all__'


class GroupTreeSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника групп аттестации. """
    properties = ParticipantGroupPropertiesSerializer(many=True)

    class Meta:
        model = Group
        fields = '__all__'


class OptionSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника настроек пользователя. """

    class Meta:
        model = Option
        fields = '__all__'


class ComplexSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника комплексов. """

    class Meta:
        model = Complex
        fields = '__all__'


class ComplexTreeSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника комплексов без владельца. """

    class Meta:
        model = Complex
        fields = ('id', 'name', 'points')


class ComplexGroupSerializer(serializers.ModelSerializer):
    """ Сериализатор групп комплексов. """

    class Meta:
        model = ComplexGroup
        fields = '__all__'


class ComplexGroupTreeSerializer(serializers.ModelSerializer):
    """ Сериализатор групп комплексов с комплексами и баллами. """
    properties = ComplexTreeSerializer(many=True)

    class Meta:
        model = ComplexGroup
        fields = '__all__'


class BeltDemandSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника требований к поясам. """

    class Meta:
        model = BeltDemand
        fields = '__all__'


class BeltDemandUsedPropertiesSerializer(serializers.ModelSerializer):
    """ Сериализатор состава требований по поясам. """
    used = serializers.BooleanField()

    class Meta:
        model = Complex
        fields = ('id', 'name', 'used')


class BeltDemandUsedSerializer(serializers.ModelSerializer):
    """ Сериализатор требований по поясам с их использованием. """
    properties = BeltDemandUsedPropertiesSerializer(many=True)

    class Meta:
        model = ComplexGroup
        fields = ('id', 'name', 'properties')


class AttestationSerializer(serializers.ModelSerializer):
    """ Сериализатор данных аттестации. """

    class Meta:
        model = Attestation
        fields = '__all__'


class ParticipantGroupSerializer(serializers.ModelSerializer):
    """ Сериализатор состава групп. """
    participant = ParticipantSerializer()
    group = GroupSerializer()

    class Meta:
        model = ParticipantGroup
        fields = '__all__'


class AttestationComplexSerializer(serializers.Serializer):
    """ Сериализатор выставленных баллов. """
    id = serializers.IntegerField()
    name = serializers.CharField()
    points = serializers.IntegerField()
    max = serializers.IntegerField()


class AttestationResultSerializer(serializers.Serializer):
    """ Сериализатор итогов аттестации. """
    id = serializers.IntegerField()
    value = serializers.CharField()
