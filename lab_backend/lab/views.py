from rest_framework.response import Response
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import viewsets, status
from datetime import datetime
from django.db.models import Max
from urllib.parse import quote_plus
from pymongo import MongoClient
from django.views.decorators.http import require_GET
from django.forms.models import model_to_dict
from django.db.models import Q
import json

from .serializers import RegisterSerializer
@api_view(['POST'])
@csrf_exempt
def registration(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from .models import Register
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        # Check if user exists
        user = Register.objects.get(email=email)

        # Directly compare the provided password with the stored password
        if password == user.password:
            # Successful login
            return Response({
                "message": f"Login successful as {user.role}",
                "role": user.role
            }, status=status.HTTP_200_OK)
        else:
            # Invalid password
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

    except Register.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    

from .serializers import PatientSerializer
@api_view(['POST'])
@csrf_exempt
def create_patient(request):
    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from .serializers import PatientSerializer
@api_view(['GET'])
@csrf_exempt
def get_all_patients(request):
    # Check if 'B2B' is provided in the request query parameters
    b2b = request.query_params.get('B2B', None)

    if b2b:  # If B2B has a value, retrieve all patients
        patients = Patient.objects.all()
    else:  # If B2B is None or empty, retrieve only patients meeting specific criteria
        patients = Patient.objects.filter(B2B__isnull=False)  # Adjust the filter as needed

    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_latest_patient_id(request):
    # Fetch the latest patient ID from the database
    latest_patient = Patient.objects.aggregate(Max('patient_id'))
    # If there's a patient ID, increment it, otherwise start with SD001
    if latest_patient['patient_id__max']:
        current_id = int(latest_patient['patient_id__max'].replace('SD', ''))
        new_patient_id = f"SD{str(current_id + 1).zfill(3)}"
    else:
        new_patient_id = "SD001"
    return Response({"patient_id": new_patient_id}, status=status.HTTP_200_OK)
    

from .models import Patient  # Adjust the import based on your project structure
def get_patients_by_date(request):
    # Get date from request parameters
    date = request.GET.get('date')
    
    if date:
        try:
            # Ensure the date is in the correct format
            parsed_date = datetime.strptime(date, '%Y-%m-%d').date()  # This gets a date object
            
            # Filter patients by parsed date
            patients = Patient.objects.filter(date=parsed_date)
            
            # Serialize patient details
            patient_data = [model_to_dict(patient) for patient in patients]
            
            return JsonResponse({'data': patient_data}, safe=False)
        
        except ValueError:
            # Handle date parsing error
            return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
    
    # Handle missing date parameter
    return JsonResponse({'error': 'Date parameter is required.'}, status=400)


@require_GET
def get_test_details(request):
    # URL-encode the password
    password = quote_plus('Smrft@2024')
    # Use f-string to inject the encoded password into the connection string
    client = MongoClient(f'mongodb+srv://shinovalab:{password}@cluster0.xbq9c.mongodb.net/Lab?retryWrites=true&w=majority')
    db = client['Lab']  # Access the 'Lab' database
    collection = db['Testdetails']  # Access the 'Testdetails' collection
    # Fetch all test details from the collection
    test_details = list(collection.find({}, {"_id": 0}))  # Exclude '_id' field if not needed
    return JsonResponse(test_details, safe=False)


@require_GET
def get_clinical_details(request):
    # URL-encode the password
    password = quote_plus('Smrft@2024')
    # Use f-string to inject the encoded password into the connection string
    client = MongoClient(f'mongodb+srv://shinovalab:{password}@cluster0.xbq9c.mongodb.net/Lab?retryWrites=true&w=majority')
    db = client['Lab']  # Access the 'Lab' database
    collection = db['lab_ClinicalName']  # Access the 'Testdetails' collection
    # Fetch all test details from the collection
    ClinicalName = list(collection.find({}, {"_id": 0}))  # Exclude '_id' field if not needed
    return JsonResponse(ClinicalName, safe=False)


from .models import SampleCollector
from .serializers import SampleCollectorSerializer
@api_view(['GET', 'POST'])
def sample_collector(request):
    if request.method == 'POST':
        serializer = SampleCollectorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        collectors = SampleCollector.objects.all()
        serializer = SampleCollectorSerializer(collectors, many=True)
        return Response(serializer.data)


from .models import Organisation
from .serializers import OrganisationSerializer
@api_view(['GET', 'POST'])
def add_organisation(request):
    if request.method == 'POST':
        serializer = OrganisationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        organisations = Organisation.objects.all()
        serializer = OrganisationSerializer(organisations, many=True)
        return Response(serializer.data)
    

from .models import Patient, Test
def compare_test_details(request):
    date = request.GET.get('date')
    patient_id = request.GET.get('patient_id')

    if not date or not patient_id:
        return JsonResponse({'error': 'Date and patient_id parameters are required'}, status=400)

    try:
        formatted_date = datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
    except ValueError:
        return JsonResponse({'error': 'Invalid date format. Expected YYYY-MM-DD.'}, status=400)

    # Query MongoDB for the specified patient and formatted date
    patients = Patient.objects.filter(date=formatted_date, patient_id=patient_id)

    test_data = []
    for patient in patients:
        try:
            # Parse test_list from JSON string or use directly if already a list
            test_list = json.loads(patient.testname) if isinstance(patient.testname, str) else patient.testname
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid testname format'}, status=400)

        for test_item in test_list:
            testname = test_item.get('testname')
            amount = test_item.get('amount')
            
            # Fetch all matching test details from the Test model
            test_details = Test.objects.filter(testname=testname)

            for test_detail in test_details:
                test_info = {
                    "patient_id": patient.patient_id,
                    "testname": test_detail.testname,
                    "specimen_type": test_detail.specimen_type,
                    "unit": test_detail.unit,
                    "reference_range": test_detail.reference_range,
                    "amount": amount,
                }
                test_data.append(test_info)  # Append each test detail to test_data

    # Return all collected test details in the response
    return JsonResponse({'data': test_data})


from .serializers import TestValueSerializer
from .models import Patient, Test
@api_view(['POST'])
def save_test_value(request):
    payload = request.data
    try:
        # Fetch patient details
        patient = Patient.objects.get(patient_id=payload['patient_id'])
        
        # Prepare data with patient information and nested JSON test details
        test_details_json = payload.get("testdetails", [])

        data = {
            "patient_id": patient.patient_id,
            "patientname": patient.patientname,
            "age": patient.age,
            "date": payload.get("date"),
            "testdetails": test_details_json,  # Store test details as JSON array
        }

        # Serialize and save
        serializer = TestValueSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)


from .models import  TestValue
@api_view(['GET'])
def get_test_report(request):
    day = request.GET.get('day')
    month = request.GET.get('month')
    queryset = TestValue.objects.all()

    # Filter based on day and month by constructing the date manually
    if day and month:
        queryset = [obj for obj in queryset if obj.date.day == int(day) and obj.date.month == int(month)]
    elif month:
        queryset = [obj for obj in queryset if obj.date.month == int(month)]

    report_data = [
        {
            "patient_id": obj.patient_id,
            "patientname": obj.patientname,
            "age": obj.age,
            "date": obj.date,
            "testdetails": obj.testdetails,
        }
        for obj in queryset
    ]
    return Response({"data": report_data})

# View to retrieve all test values
def get_test_values(request):
    test_values = TestValue.objects.all()
    data = [
        {
            "patient_id": test.patient_id,
            "patientname": test.patientname,
            "age": test.age,
            "date": test.date,
            "testdetails": test.testdetails
        }
        for test in test_values
    ]
    return JsonResponse(data, safe=False)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from pymongo import MongoClient
from urllib.parse import quote_plus
import json

# MongoDB connection
password = quote_plus('Smrft@2024') 
client = MongoClient(f'mongodb+srv://shinovalab:{password}@cluster0.xbq9c.mongodb.net/?retryWrites=true&w=majority')
db = client.Lab  # Your database name
collection = db.lab_testvalue  # Your collection name

@csrf_exempt
@require_http_methods(["PATCH"])
def update_test_detail(request, patient_id, test_index):
    # Load the request data
    update_data = json.loads(request.body)

    # Find the test value document for the given patient_id
    test_value = collection.find_one({"patient_id": patient_id})

    # Check if the document exists
    if test_value is None:
        return JsonResponse({"error": "Patient not found."}, status=404)

    # Convert testdetails from string to list
    try:
        test_details = json.loads(test_value.get("testdetails", "[]"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Failed to decode test details."}, status=500)

    # Check for valid index
    if 0 <= test_index < len(test_details):
        # Update approve or rerun status based on request data   
        if "rerun" in update_data:
            test_details[test_index]["rerun"] = update_data["rerun"]

        # Update the document in the MongoDB collection
        result = collection.update_one(
            {"patient_id": patient_id},
            {"$set": {"testdetails": json.dumps(test_details)}}
        )

        # Check if the update was acknowledged
        if result.acknowledged:
            return JsonResponse({"message": "Test detail updated successfully."})
        else:
            return JsonResponse({"error": "Failed to update test detail."}, status=500)
    else:
        return JsonResponse({"error": "Invalid test index."}, status=400)
    
    
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from urllib.parse import quote_plus
import json

# MongoDB connection
password = quote_plus('Smrft@2024')
client = MongoClient(f'mongodb+srv://shinovalab:{password}@cluster0.xbq9c.mongodb.net/?retryWrites=true&w=majority')
db = client.Lab  # Your database name
collection = db.lab_testvalue  # Your collection name

@csrf_exempt  # Disable CSRF for this view
def approve_all_tests(request, patient_id):
    if request.method == 'PATCH':
        try:
            # Fetch the TestValue document based on the patient_id
            test_value = collection.find_one({'patient_id': patient_id})
            if not test_value:
                return JsonResponse({'success': False, 'error': 'Test value not found.'}, status=404)

            # Load the testdetails from JSON string to Python list
            test_details = json.loads(test_value['testdetails'])

            # Update the approve field for all test details
            for detail in test_details:
                detail['approve'] = True  # Set approve to True for each test detail
            
            # Convert back to JSON string
            updated_test_details = json.dumps(test_details)

            # Update the document in the collection
            result = collection.update_one(
                {'patient_id': patient_id},
                {'$set': {'approve': True, 'testdetails': updated_test_details}}
            )

            if result.modified_count == 0:
                return JsonResponse({'success': False, 'error': 'Update failed.'}, status=500)

            # Return the updated test value as JSON
            return JsonResponse({'success': True, 'data': {
                'patient_id': test_value['patient_id'],
                'patientname': test_value['patientname'],
                'age': test_value['age'],
                'date': test_value['date'],
                'testdetails': updated_test_details,
                'approve': True
            }}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Failed to decode test details JSON.'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=405)