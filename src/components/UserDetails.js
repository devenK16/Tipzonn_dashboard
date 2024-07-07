import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { saveAs } from 'file-saver';

function UserDetails({ userId, onBack }) {
  const [userDetails, setUserDetails] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchUserDetails(userId);
    fetchAnalytics(userId);
    fetchWorkers(userId);
  }, [userId]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`https://backend.tipzonn.com/api/users/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('There was an error fetching the user details!', error);
    }
  };

  const fetchAnalytics = async (userId) => {
    try {
      const response = await axios.get(`https://backend.tipzonn.com/api/users/${userId}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('There was an error fetching the analytics!', error);
    }
  };

  const fetchWorkers = async (userId) => {
    try {
      const response = await axios.get(`https://backend.tipzonn.com/api/workers/dashboard/${userId}`);
      setWorkers(response.data);
    } catch (error) {
      console.error('There was an error fetching the workers!', error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`https://backend.tipzonn.com/api/admin/users/${userId}`, { status: userDetails.status });
      alert('Status updated successfully');
    } catch (error) {
      console.error('There was an error updating the status!', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const storageRef = ref(storage, `userImages/${userId}/${selectedFile.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(snapshot.ref);
      
      // Update user's qrCode with the new image URL
      await axios.put(`https://backend.tipzonn.com/api/admin/users/${userId}`, { qrCode: imageUrl });
      
      alert('Image uploaded successfully!');
      fetchUserDetails(userId); // Refresh user details
    } catch (error) {
      console.error('Error uploading file: ', error);
      alert('Failed to upload image.');
    }
  };

  const handleDownload = () => {
    if (userDetails.qrCode) {
      const downloadUrl = `https://backend.tipzonn.com/api/admin/users/${userId}/download-qr`;
      
      fetch(downloadUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${userDetails.name.replace(/\s+/g, '_')}_QrCode.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error downloading QR code:', error);
          alert('Failed to download QR code. Please try again.');
        });
    } else {
      alert('QR Code not available for download.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={onBack} className="bg-blue-500 text-white p-2 rounded mb-4">
        Back
      </button>
      {userDetails && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">User Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input 
                type="text" 
                name="name" 
                value={userDetails.name} 
                readOnly={true}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input 
                type="text" 
                name="email" 
                value={userDetails.email} 
                readOnly={true}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">Contact No</label>
              <input 
                type="text" 
                name="contactNo" 
                value={userDetails.contactNo} 
                readOnly={true}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input 
                type="text" 
                name="address" 
                value={userDetails.address} 
                readOnly={true}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">Status</label>
              <select 
                name="status" 
                value={userDetails.status} 
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              >
                <option value="pending">Pending</option>
                <option value="qr generated">QR Generated</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Tipzonn Link</label>
              <input 
                type="text" 
                value={`https://www.tipzonn.com/?tzId=${userId}`}
                readOnly={true}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Upload Image</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              className="border rounded p-2 w-full"
            />
            <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded mt-2">
              Upload Image
            </button>
          </div>

          {userDetails.qrCode && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">QR Code</h2>
              <img src={userDetails.qrCode} alt="QR Code" className="w-48 h-48 mt-2" />
              <button 
                onClick={handleDownload}
                className="bg-green-500 text-white p-2 rounded mt-2 inline-block"
              >
                Download QR Code
              </button>
            </div>
          )}

          <button onClick={handleUpdateStatus} className="bg-green-500 text-white p-2 rounded mt-4">
            Update Status
          </button>
        </div>
      )}

      {analytics && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">User Analytics</h2>
          <p>Total: {analytics.total}</p>
          <p>Daily: {analytics.daily}</p>
          <h3 className="text-xl font-bold mt-4">Monthly Breakdown</h3>
          <ul>
            {analytics.monthlyBreakdown.map((month, index) => (
              <li key={index}>
                {month.year}-{month.month}: {month.totalTip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Workers</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Profession</th>
              <th className="py-2 px-4 border-b">Contact No</th>
              <th className="py-2 px-4 border-b">Dashboard</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(worker => (
              <tr key={worker._id}>
                <td className="py-2 px-4 border-b">{worker.name}</td>
                <td className="py-2 px-4 border-b">{worker.profession}</td>
                <td className="py-2 px-4 border-b">{worker.contactNo}</td>
                <td className="py-2 px-4 border-b">
                  <a href={worker.dashboardURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Dashboard
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDetails;