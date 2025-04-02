"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/providers/db'

interface Doctor {
  d_id: number;
  name: string;
  specialization: string;
  experience: number;
  mobile_no: string;
  email_id: string;
  consult_fees: number;
  schedule: string;
}

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patient_id, setPatient_id] = useState<string>('');

  const router = useRouter();

 

  const bookAppointment = async () => {
    
    try {
      const { data, error } = await supabase.from('appointment').insert({
        p_id: patient_id,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        doctor_id: selectedDoctor?.d_id,
        appointment_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const specializations = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Ophthalmology',
    'ENT',
    'Psychiatry',
    'Dentistry',
    'General Medicine',
    'Gynecology',
    'Urology'
  ];

  const filteredDoctors = selectedSpecialization
    ? doctors.filter(doctor => doctor.specialization === selectedSpecialization)
    : [];

  useEffect(() => {
    const fetchDoctors = async () => {
        const unparsed_patient_id = localStorage.getItem('patientInfo');
        if (unparsed_patient_id) {
           const patient_id = JSON.parse(unparsed_patient_id);
           setPatient_id(patient_id);
        }
        if (!selectedSpecialization) return;
      
      setLoading(true);
      try {
        const data = await supabase.from('doctor').select('*').eq('specialization', selectedSpecialization);
        if (data.data) {
          setDoctors(data.data as Doctor[]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization]);

  if (loading && selectedSpecialization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚕️</div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-gray-600">Select a specialization and choose your preferred doctor</p>
        </div>

        {/* Specialization Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Select Specialization</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => {
                  setSelectedSpecialization(spec);
                  setSelectedDoctor(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedSpecialization === spec
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="text-2xl mb-2">{getSpecializationEmoji(spec)}</div>
                <span className="font-medium">{spec}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Selection */}
        {selectedSpecialization && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Select Doctor</h2>
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600">No doctors available in this specialization</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.d_id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedDoctor?.d_id === doctor.d_id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.experience} years of experience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-600 font-medium">₹{doctor.consult_fees}</p>
                        <p className="text-sm text-gray-500">per consultation</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        {selectedDoctor && (
          <div className="mt-8 text-center">
            <button
              onClick={bookAppointment}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
            >
              Proceed to Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const getSpecializationEmoji = (specialization: string): string => {
  const emojiMap: { [key: string]: string } = {
    'Cardiology': '❤️',
    'Neurology': '🧠',
    'Pediatrics': '👶',
    'Orthopedics': '🦴',
    'Dermatology': '🧬',
    'Ophthalmology': '👁️',
    'ENT': '👂',
    'Psychiatry': '🧠',
    'Dentistry': '🦷',
    'General Medicine': '⚕️',
    'Gynecology': '👩‍⚕️',
    'Urology': '🩺'
  };
  return emojiMap[specialization] || '🏥';
};

export default BookAppointmentPage;