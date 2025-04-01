"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/Logoutbutton';

interface AdminData {
  name: string;
  email_id: string;
  address: string;
  gender: string;
  created_at: string;
  admin_login_id: string;
}

const AdminInfoPage = () => {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const response = await fetch('/api/getpatient', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        if (data.user) {
          setAdminData(data.user);
        } else {
          setError('No admin data found');
        }
      } catch (error) {
        router.push('/auth/adminlogin');
        setError('Failed to fetch admin data');
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    getAdminData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No admin data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">{adminData.name}</h1>
                <p className="text-blue-100">Administrator</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">👤</span>
                  Personal Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Gender:</span>
                      <span className="font-medium">{adminData.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Admin ID:</span>
                      <span className="font-medium">{adminData.admin_login_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">📞</span>
                  Contact Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Email:</span>
                      <span className="font-medium">{adminData.email_id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Address:</span>
                      <span className="font-medium">{adminData.address}</span>
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Account Information */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">📅</span>
                  Account Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Member Since:</span>
                      <span className="font-medium">
                        {new Date(adminData.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfoPage;