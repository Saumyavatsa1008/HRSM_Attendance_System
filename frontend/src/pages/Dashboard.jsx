import { CalendarCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Employee Management Card */}
        <Link to="/employees" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Employee Management</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">Manage Records</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-indigo-700 hover:text-indigo-900">
                View all employees
              </span>
            </div>
          </div>
        </Link>

        {/* Attendance Management Card */}
        <Link to="/attendance" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Attendance Management</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">Track Daily Attendance</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-indigo-700 hover:text-indigo-900">
                Mark attendance
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
