from django.db import models

class Register(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    role = models.CharField(max_length=500)
    email = models.EmailField(max_length=500, unique=True)
    password = models.CharField(max_length=500)
    confirmPassword = models.CharField(max_length=500)


class Patient(models.Model):
    patient_id = models.CharField(max_length=10, unique=True)
    patientname = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    email = models.EmailField()
    address = models.TextField(blank=True)
    age = models.IntegerField()
    age_type = models.CharField(max_length=10)  # Adjusted field name for consistency
    sample_collector = models.CharField(max_length=100)
    organisation = models.CharField(max_length=100)
    date = models.DateField()
    # New fields
    lab_id = models.CharField(max_length=50, blank=True)
    refby = models.CharField(max_length=100, blank=True)  # Referring doctor or reference
    branch = models.CharField(max_length=100, blank=True)
    B2B = models.CharField(max_length=100, blank=True)
    home_collection = models.CharField(max_length=100, blank=True)
    testname = models.JSONField(max_length=100)
    totalAmount= models.CharField(max_length=100, blank=True)
    payment_method = models.CharField(max_length=50)
    def __str__(self):
        return self.patientname


class SampleCollector(models.Model):
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField()

    def __str__(self):
        return self.name   
    

class Organisation(models.Model):
    REFERRAL_TYPE_CHOICES = [
        ('Doctor', 'Doctor'),
        ('Hospital', 'Hospital'),
        ('Lab', 'Lab'),
    ]
    referral_type = models.CharField(max_length=50, choices=REFERRAL_TYPE_CHOICES)
    name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255, blank=True, null=True)
    compliment_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    def __str__(self):
        return f"{self.name} ({self.referral_type})"
    

class Test(models.Model):
    testname = models.CharField(max_length=100, unique=True)
    specimen_type = models.CharField(max_length=50)
    unit = models.CharField(max_length=20)
    reference_range = models.CharField(max_length=50)


class TestValue(models.Model):
    patient_id = models.CharField(max_length=10)
    patientname = models.CharField(max_length=100)
    age = models.IntegerField()
    date = models.DateField()
    testdetails = models.JSONField()  # Store all test details in JSON format
    approve = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.patientname} ({self.patient_id}) - {self.date}"

