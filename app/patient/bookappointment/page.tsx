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

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface Patient {
  p_id: string;
  // ... other fields
}

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patient_id, setPatient_id] = useState<Patient | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  

  const parseSchedule = (schedule: string): TimeSlot[] => {
    return schedule.split(',').map(slot => {
      const [day, timeRange] = slot.split(' - ');
      const [startTime, endTime] = timeRange.split(' TO ');
      return { day, startTime, endTime };
    });
  };

  const generateTimeSlots = (schedule: TimeSlot[]): string[] => {
    const slots: string[] = [];
    schedule.forEach(slot => {
      const start = new Date(`2000-01-01 ${slot.startTime}`);
      const end = new Date(`2000-01-01 ${slot.endTime}`);
      
      while (start < end) {
        slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        start.setMinutes(start.getMinutes() + 30); // 30-minute intervals
      }
    });
    return slots;
  };

  useEffect(() => {
    if (selectedDoctor) {
      const schedule = parseSchedule(selectedDoctor.schedule);
      const slots = generateTimeSlots(schedule);
      setAvailableTimeSlots(slots);
    }
  }, [selectedDoctor]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    
    if (selectedDoctor) {
      const schedule = parseSchedule(selectedDoctor.schedule);
      const isDayAvailable = schedule.some(slot => slot.day === day);
      
      if (!isDayAvailable) {
        setError(`Doctor is not available on ${day}`);
        setSelectedDate('');
        setSelectedTime('');
        return;
      }
    }
    
    setSelectedDate(e.target.value);
    setError('');
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    try {
      const { data, error } = await supabase.from('appointment').insert({
        p_id: patient_id?.p_id,
        date: selectedDate,
        time: selectedTime,
        d_id: selectedDoctor?.d_id,
      });
      
      if (error){
        if (error.code === '23505'){
          setError('Appointment already exists');
        }
        else{
          console.log(error, "im here");
          throw error;
        }
      }
      else{
        console.log(data, "im here");
      }
      
      // Handle success
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Failed to book appointment');
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
        const parsedPatient = JSON.parse(unparsed_patient_id);
        setPatient_id(parsedPatient);
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
                    {selectedDoctor?.d_id === doctor.d_id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Schedule:</h4>
                        <div className="space-y-2">
                          {parseSchedule(doctor.schedule).map((slot, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <span className="w-24 font-medium">{slot.day}</span>
                              <span>{slot.startTime} - {slot.endTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add after doctor selection */}
        {selectedDoctor && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Select Date & Time</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a time</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Update the book appointment button */}
        {selectedDoctor && selectedDate && selectedTime && (
          <div className="mt-8 text-center">
            <button
              onClick={bookAppointment}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
            >
              Book Appointment
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