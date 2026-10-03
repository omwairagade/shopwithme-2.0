import { useState, useEffect } from 'react';
import { Trash2, Shield, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import DataTable from '../../components/admin/DataTable';

const ROLE_OPTIONS = ['customer', 'admin'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <UserCircle size={20} className="text-gray-400" />
          <span className="font-medium text-gray-700">{row.name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row._id, e.target.value)}
          className={`border-0 rounded-full px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
            row.role === 'admin' ? 'bg-indigo-50 text-primary' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Shield size={22} className="text-primary" /> Users
      </h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          renderActions={(row) => (
            <button
              onClick={() => handleDelete(row._id, row.name)}
              disabled={row.role === 'admin'}
              className="text-red-500 hover:text-red-700 transition disabled:text-gray-300"
            >
              <Trash2 size={16} />
            </button>
          )}
        />
      )}
    </div>
  );
}
