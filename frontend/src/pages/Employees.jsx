import { Trash2, UserPlus, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    department: '',
    role: 'Employee'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        api.get('/employees/'),
        api.get('/attendance/')
      ]);
      setEmployees(empRes.data);
      setAttendanceRecords(attRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees/', newEmployee);
      fetchData();
      setShowAddForm(false);
      setNewEmployee({ full_name: '', email: '', department: '', role: 'Employee' });
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  // Calculate total present days for an employee
  const getTotalPresentDays = (employeeId) => {
    if (!Array.isArray(attendanceRecords)) return 0;
    return attendanceRecords.filter(
      record => record.employee_id === employeeId && record.status === 'Present'
    ).length;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Employee
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={newEmployee.full_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  required
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {employees.map((employee) => {
            const presentDays = getTotalPresentDays(employee.id);
            return (
              <li key={employee.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{employee.full_name}</h3>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-500">{employee.department} • {employee.role}</p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CalendarCheck className="h-4 w-4" />
                      <span className="font-medium">{presentDays}</span>
                      <span className="text-gray-500">days present</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            );
          })}
          {employees.length === 0 && (
            <li className="px-6 py-4 text-center text-gray-500">No employees found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Employees;