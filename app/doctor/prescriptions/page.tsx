'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/providers/db'
import Link from 'next/link'

interface Prescription {
  appointment_id: string
  diagnosis: string
  created_at: string | null
  patients: {
    name: string
    gender: string
  }
  p_id: string
}

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Get doctor info from localStorage
        const unparsedDoctorInfo = localStorage.getItem('doctorInfo')
        if (!unparsedDoctorInfo) {
          throw new Error('Doctor information not found')
        }
        
        const doctorInfo = JSON.parse(unparsedDoctorInfo)
        const doctorId = doctorInfo.d_id;
        console.log(doctorId, "doctorId")
        
        // Fetch prescriptions with patient information
        const { data, error } = await supabase
          .from('prescription')
          .select(
            'p_id ,patients(name,gender), appointment_id, diagnosis, created_at'
          )
          .eq('d_id', doctorId)
        
        if (error) throw error

        // Transform data to match our interface
        const formattedData = data.map((item: any) => ({
          appointment_id: item.appointment_id,
          diagnosis: item.diagnosis,
          created_at: item.created_at,
          patients: {
            name: item.patients.name,
            gender: item.patients.gender
          },
          p_id: item.p_id
        }))

        // Sort by created_at (null values at bottom)
        const sortedData = formattedData.sort((a, b) => {
          if (!a.created_at) return 1
          if (!b.created_at) return -1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        // Ensure unique items by filtering out duplicates based on p_id
        const uniquePrescriptions = Array.from(
          new Map(sortedData.map(item => [item.p_id, item])).values()
        );

        setPrescriptions(uniquePrescriptions)
      } catch (err) {
        console.error('Error fetching prescriptions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load prescriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Prescriptions</h1>
      
      {prescriptions.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">No prescriptions found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription, index) => (
            <div key={`${prescription.p_id}-${index}`} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{prescription.patients.name}</h2>
                  <p className="text-gray-600 mt-1">Gender: {prescription.patients.gender}</p>
                  <div className="mt-3">
                    <p className="font-medium text-gray-700">Diagnosis:</p>
                    <p className="text-gray-600 mt-1">{prescription.diagnosis}</p>
                  </div>
                  <div className="mt-4">
                    <Link 
                      href={`/doctor/prescriptions/${prescription.p_id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <span>View & Edit Prescription</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {prescription.created_at ? (
                    new Date(prescription.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  ) : (
                    'No date'
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Prescriptions