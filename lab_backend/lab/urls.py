# your_app/urls.py

from django.urls import path
from .views import registration,login
from .views import create_patient,sample_collector,add_organisation,get_latest_patient_id,get_clinical_details,get_test_details,update_test_detail,approve_all_tests
from .views import get_patients_by_date,get_test_details,save_test_value,compare_test_details,get_test_report,get_all_patients,get_test_values

urlpatterns = [
    path('registration/', registration, name='registration'),
    path('login/', login, name='login'),
    path('patient/create/', create_patient, name='create_patient'),
    path('latest-patient-id/', get_latest_patient_id, name='get_latest_patient_id'),
    path('patients/', get_patients_by_date, name='get_patients_by_date'),
    path('test-details/', get_test_details, name='get_test_details'),
    path('clinical-details/', get_clinical_details, name='get_clinical_details'),
    path('compare_test_details/', compare_test_details, name='compare_test_details'),
    path('test-value/save/', save_test_value, name='save_test_value'),
    path('sample-collector/', sample_collector, name='create_sample_collector'),
    path('organisation/', add_organisation, name='create_organisation'),
    path('test-report/', get_test_report, name='get_test_report'),
    path('all-patients/', get_all_patients, name='get_all_patients'),
    path('test-values/', get_test_values, name='get_test_values'),      
    path('test-values/<str:patient_id>/<int:test_index>/', update_test_detail, name='update_test_detail'),
    path('test-values/<str:patient_id>/approve-all/', approve_all_tests, name='approve-all')

]
