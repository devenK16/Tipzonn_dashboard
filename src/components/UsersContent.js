import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UsersContent({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://backend.tipzonn.com/api/admin/users?page=${page}&limit=20`);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Removed handleStatusChange function to prevent status update from this component

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.status}</td> {/* Display status as plain text */}
              <td className="py-2">
                <button onClick={() => onSelectUser(user._id)} className="bg-blue-500 text-white p-2 rounded">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button 
          className="bg-gray-300 p-2 rounded" 
          onClick={handlePrevious}
          disabled={page === 1}
        >
          Previous
        </button>
        <button 
          className="bg-gray-300 p-2 rounded" 
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UsersContent;
