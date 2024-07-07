import React from 'react';

function Sidebar({ onSelectSection }) {
  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      <ul>
        <li 
          className="p-4 hover:bg-gray-200 cursor-pointer" 
          onClick={() => onSelectSection('home')}
        >
          <i className="fas fa-home"></i> Home
        </li>
        <li 
          className="p-4 hover:bg-gray-200 cursor-pointer" 
          onClick={() => onSelectSection('users')}
        >
          <i className="fas fa-users"></i> Users
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
