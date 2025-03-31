// pages/patient.js
'use client'
import { useState } from 'react'
import { supabase } from '@/providers/db'

export default function AddPatient() {
  const [patient, setPatient] = useState({
    name: '',
    dob: '',
    gender: '',
    blood_group: '',
    email_id: '',
    address: '',
    mobile_no: '',
    cghs_private: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPatient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from('patients').insert([patient])

    if (error) {
      alert('Error inserting data: ' + error.message)
    } else {
      alert('Patient added successfully!')
      setPatient({
        name: '',
        dob: '',
        gender: '',
        blood_group: '',
        email_id: '',
        address: '',
        mobile_no: '',
        cghs_private: '',
        password: '',
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Patient</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={patient.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={patient.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <select
              name="blood_group"
              value={patient.blood_group}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <input
              type="email"
              name="email_id"
              placeholder="Email ID"
              value={patient.email_id}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="number"
              name="mobile_no"
              placeholder="Mobile No"
              value={patient.mobile_no}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <select
              name="cghs_private"
              value={patient.cghs_private}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Type</option>
              <option value="CGHS">CGHS</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={patient.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
