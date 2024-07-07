import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardContent() {
  const [selectedTab, setSelectedTab] = useState('tips');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let url = '';
      if (selectedTab === 'tips') {
        url = 'https://backend.tipzonn.com/api/admin/all-users/analytics';
      } else if (selectedTab === 'fees') {
        url = 'https://backend.tipzonn.com/api/admin/fees/analytics';
      }
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedTab]);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard</h1>
      <div className="mb-6">
        <button 
          className={`mr-4 p-2 text-lg font-semibold text-gray-700 ${selectedTab === 'tips' ? 'border-b-2 border-black' : ''}`}
          onClick={() => setSelectedTab('tips')}
        >
          Tips
        </button>
        <button 
          className={`p-2 text-lg font-semibold text-gray-700 ${selectedTab === 'fees' ? 'border-b-2 border-black' : ''}`}
          onClick={() => setSelectedTab('fees')}
        >
          Fees
        </button>
      </div>
      {data ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Total {selectedTab}</h2>
          <div className="grid grid-cols-3 gap-4">
        
            <div className="p-4 bg-white border rounded shadow-sm">
              <h3 className="text-lg font-semibold">Total {selectedTab}</h3>
              <p className="text-2xl">₹ {data.total}</p>
            </div>
            <div className="p-4 bg-white border rounded shadow-sm">
              <h3 className="text-lg font-semibold">Daily {selectedTab}</h3>
              <p className="text-2xl">₹ {data.daily}</p>
            </div>
            <div className="p-4 bg-white border rounded shadow-sm">
              <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
              <ul>
                {data.monthlyBreakdown.map((month, index) => (
                  <li key={index}>
                    {month.year}-{month.month}: ₹ {selectedTab === 'tips' ? month.totalTip : month.fees}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default DashboardContent;
