from rest_framework import serializers

from attestation.models import (
    Belt, Participant, Group, Option,
    ComplexGroup, Complex, BeltDemand,
    Attestation, ParticipantGroup,
    PhysicalTest, AdditionalTest,
    AdditionalTestCriteria, AdditionalTestDemand,
    PhysicalTestDemand, PhysicalTestPoint,
    AttestationInfo
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


class AdditionalTestDemandSerializer(serializers.ModelSerializer):
    """ Сериализатор состава требований доп комплексов по поясам. """

    class Meta:
        model = AdditionalTestDemand
        fields = '__all__'


class AdditionalTestDemandUsedPropertiesSerializer(
    serializers.ModelSerializer
):
    """ Сериализатор состава требований по поясам. """
    used = serializers.BooleanField()

    class Meta:
        model = AdditionalTestCriteria
        fields = ('id', 'name', 'used')


class AdditionalTestDemandUsedSerializer(serializers.ModelSerializer):
    """ Сериализатор дополнительных тестов по поясам с их использованием. """
    properties = AdditionalTestDemandUsedPropertiesSerializer(many=True)

    class Meta:
        model = AdditionalTest
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
    points = serializers.FloatField()
    max = serializers.IntegerField()


class ComplexGroupPointsSerializer(serializers.Serializer):
    """ Сериализатор баллов группы комплексов. """
    name = serializers.CharField()
    point = serializers.FloatField()


class AttestationResultSerializer(serializers.Serializer):
    """ Сериализатор итогов аттестации. """
    id = serializers.IntegerField()
    value = serializers.CharField()
    complexes = ComplexGroupPointsSerializer(many=True)


class PhysicalTestSerializer(serializers.ModelSerializer):
    """ Сериализатор физических комплексов. """
    class Meta:
        model = PhysicalTest
        fields = '__all__'


class AdditionalTestSerializer(serializers.ModelSerializer):
    """ Сериализатор дополнительных комплексов. """
    class Meta:
        model = AdditionalTest
        fields = '__all__'


class AdditionalTestCriteriaSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника критериев дополнительных комплексов. """

    class Meta:
        model = AdditionalTestCriteria
        fields = '__all__'


class CriteriaTreeSerializer(serializers.ModelSerializer):
    """ Сериализатор справочника критериев без владельца. """

    class Meta:
        model = AdditionalTestCriteria
        fields = ('id', 'name', 'points')


class TestTreeSerializer(serializers.ModelSerializer):
    """ Сериализатор групп комплексов с критериями и баллами. """
    properties = CriteriaTreeSerializer(many=True)

    class Meta:
        model = AdditionalTest
        fields = '__all__'


class PhysicalTestDemandSerializer(serializers.ModelSerializer):
    """ Сериализатор требований физических комплексов. """
    test = PhysicalTestSerializer()

    class Meta:
        model = PhysicalTestDemand
        fields = '__all__'


class PhysicalTestPointSerializer(serializers.ModelSerializer):
    """ Сериализатор критериев процентажа физических тестов. """

    class Meta:
        model = PhysicalTestPoint
        fields = '__all__'


class PhysicalAttestationSerializer(serializers.Serializer):
    """ Сериализатор выставленных баллов физических комплексов. """
    id = serializers.IntegerField()
    name = serializers.CharField()
    points = serializers.FloatField()
    max = serializers.IntegerField()


class AdditionalAttestationSerializer(serializers.Serializer):
    """ Сериализатор выставленных баллов дополнительных комплексов. """
    name = serializers.CharField()


class DemandsByGroupAndTestSerializer(serializers.Serializer):
    """
    Сериализатор информации по критериям и баллов для физического комплекса.
    """
    points = serializers.IntegerField()
    criteria = serializers.IntegerField()


class AttestationInfoSerializer(serializers.ModelSerializer):
    """ Сериализатор информации об аттестации. """

    class Meta:
        model = AttestationInfo
        fields = '__all__'
