# forms.py
from rest_framework import serializers
from .models import Register
from bson import ObjectId
class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)
    def to_internal_value(self, data):
        return ObjectId(data)
    

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Register
        fields = '__all__'


from .models import Patient
class PatientSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Patient
        fields = '__all__'


from .models import SampleCollector
class SampleCollectorSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = SampleCollector
        fields = '__all__'


from .models import Organisation
class OrganisationSerializer(serializers.ModelSerializer):
    # Convert ObjectId to string if using MongoDB
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Organisation
        fields = '__all__'


from .models import TestValue
class TestValueSerializer(serializers.ModelSerializer):
    testdetails = serializers.JSONField()  # Store multiple test details as JSON
    class Meta:
        model = TestValue  # Replace with your model name
        fields = ['patient_id', 'patientname', 'age', 'date', 'testdetails']