import { useEffect, useState } from 'react';
import { getUsers } from '../../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Admin' : 'Customer'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}