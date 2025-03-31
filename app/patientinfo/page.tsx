'use client'
import React, { useEffect, useState } from 'react'
import LogoutButton from '@/components/Logoutbutton'

interface PatientData {
  user?: {
    name: string;
  };
}

const Page = () => {
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    
    useEffect(() => {
        const fetchPatientData = async () => {
          try {
            const response = await fetch('/api/getpatient', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log(data, 'data');
              setPatientData(data);
            }
          } catch (error) {
            console.error('Error fetching patient data:', error);
          }
        };
    
        fetchPatientData();
    }, []);
    
    return (
        <div>patientData : {patientData?.user?.name}
            <LogoutButton />
        </div>
    )
}

export default Page