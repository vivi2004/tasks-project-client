import { ChartBarIcon, ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const stats = [
  { id: 1, name: 'Total Projects', value: '24', icon: ClipboardDocumentListIcon, change: '+12%', changeType: 'increase' },
  { id: 2, name: 'Active Tasks', value: '18', icon: CheckCircleIcon, change: '+2.5%', changeType: 'increase' },
  { id: 3, name: 'Tasks This Week', value: '32', icon: ClockIcon, change: '+18%', changeType: 'increase' },
  { id: 4, name: 'Productivity', value: '86%', icon: ChartBarIcon, change: '+4.3%', changeType: 'increase' },
];

const recentActivity = [
  { id: 1, project: 'Website Redesign', action: 'Task completed', time: '2m ago' },
  { id: 2, project: 'Mobile App', action: 'New task assigned', time: '1h ago' },
  { id: 3, project: 'Dashboard UI', action: 'Comment from Sarah', time: '3h ago' },
  { id: 4, project: 'API Integration', action: 'Task updated', time: '5h ago' },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name || 'User'}! Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-md">
                  <stat.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>{' '}
                <span className="text-gray-500">vs last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest updates from your projects</p>
            </div>
            <div className="bg-white overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 text-sm font-medium">
                            {activity.project.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{activity.project}</p>
                        <p className="text-sm text-gray-500">{activity.action}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Common tasks and actions</p>
            </div>
            <div className="p-6 space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Project
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Task
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Report
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Deadlines</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Tasks due soon</p>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Complete user authentication
                        </p>
                        <p className="text-sm text-gray-500">Due tomorrow</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          High
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Update documentation
                        </p>
                        <p className="text-sm text-gray-500">Due in 2 days</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Medium
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;