import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import UsersContent from './components/UsersContent';
import UserDetails from './components/UserDetails';

function App() {
  const [selectedSection, setSelectedSection] = useState('home');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSelectSection={setSelectedSection} />
      {selectedSection === 'home' && <DashboardContent />}
      {selectedSection === 'users' && (
        <div className="flex-1 p-6">
          {!selectedUser ? (
            <UsersContent onSelectUser={setSelectedUser} />
          ) : (
            <UserDetails userId={selectedUser} onBack={handleBack} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
