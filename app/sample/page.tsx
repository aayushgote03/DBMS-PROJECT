'use client'
import React, { useEffect, useState      } from 'react'

const page = () => {

    const [adminInfo, setAdminInfo] = useState<any>(null)
    const [patientInfo, setPatientInfo] = useState<any>(null)

    useEffect(() => {

        const adminInfo = localStorage.getItem("adminInfo")
        
        const patientInfo = localStorage.getItem("patientInfo")

        if(adminInfo){
            const parsedAdminInfo = JSON.parse(adminInfo || '{}');
            setAdminInfo(parsedAdminInfo)
            console.log(parsedAdminInfo, "parsedAdminInfo")
        }
        if(patientInfo){
            const parsedPatientInfo = JSON.parse(patientInfo || '{}');
            setPatientInfo(parsedPatientInfo)
            console.log(parsedPatientInfo, "parsedPatientInfo")
        }

        
    }, [])
  return (
    <div>
            <h1>Sample Page</h1>
            
    </div>
  )
}

export default page