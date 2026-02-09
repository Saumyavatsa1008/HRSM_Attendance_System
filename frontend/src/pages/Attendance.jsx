import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const markAttendance = async (employeeId, status) => {
    try {
      await api.post('/attendance/', {
        employee_id: employeeId,
        date: selectedDate,
        status: status
      });
      // Refresh attendance records
      const response = await api.get('/attendance/');
      setAttendanceRecords(response.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  // Optimize lookup: Create a map of employee_id -> status for the selected date
  const attendanceMap = useMemo(() => {
    const map = {};
    if (Array.isArray(attendanceRecords)) {
      attendanceRecords.forEach(record => {
        if (record.date === selectedDate) {
          map[record.employee_id] = record.status;
        }
      });
    }
    return map;
  }, [attendanceRecords, selectedDate]);

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
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        <div>
          <label className="mr-2 text-sm font-medium text-gray-700">Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-1"
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Present
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status ({selectedDate})
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(employees) && employees.map((employee) => {
              const status = attendanceMap[employee.id];
              const presentDays = getTotalPresentDays(employee.id);
              return (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">{presentDays} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {status ? (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Not Marked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => markAttendance(employee.id, 'Present')}
                      disabled={!!status}
                      className={`mr-3 text-green-600 hover:text-green-900 ${status ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => markAttendance(employee.id, 'Absent')}
                      disabled={!!status}
                      className={`text-red-600 hover:text-red-900 ${status ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {(!Array.isArray(employees) || employees.length === 0) && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No employees found. Add employees first.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;