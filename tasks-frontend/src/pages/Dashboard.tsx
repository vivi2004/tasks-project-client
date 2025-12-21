import { useEffect, useState } from 'react';
import { ChartBarIcon, ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user.store';
import projectApi from '../api/projectApi';
import taskApi from '../api/taskApi';
import { getErrorMessage } from '../utils/auth';

// Define types for our data
interface Project {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectStats {
  totalProjects: number;
  activeTasks: number;
  tasksThisWeek: number;
  completedTasks: number;
}

interface RecentActivity {
  _id: string;
  project: string;
  action: string;
  createdAt: string;
}

// Format date to relative time (e.g., '2m ago')
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const loadUser = useUserStore((state) => state.loadUser);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeTasks: 0,
    tasksThisWeek: 0,
    completedTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load user data if not already loaded
  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects
        const projectsData: Project[] = await projectApi.getProjects();
        setProjects(projectsData);

        // Calculate task stats from backend tasks endpoint (projects list doesn't include tasks)
        const totalProjects = projectsData.length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const tasksResponses = await Promise.all(
          projectsData.map((p) =>
            taskApi
              .getTasks(p._id, { page: 1, limit: 1000 })
              .then((res) => res.data)
              .catch(() => []),
          ),
        );

        const allTasks = tasksResponses.flat();

        const activeTasks = allTasks.filter((t: any) => t.status !== 'done').length;
        const completedTasks = allTasks.filter((t: any) => t.status === 'done').length;
        const tasksThisWeek = allTasks.filter((t: any) => {
          if (!t.dueDate) return false;
          return new Date(t.dueDate) > weekAgo;
        }).length;

        setStats({
          totalProjects,
          activeTasks,
          tasksThisWeek,
          completedTasks,
        });
        
        // Mock recent activity (replace with actual API call when available)
        const mockActivity: RecentActivity[] = projectsData.slice(0, 4).map((project: any, index: number) => ({
          _id: `activity-${index}`,
          project: project.name,
          action: ['created', 'updated', 'completed', 'commented on'][index % 4],
          createdAt: new Date(Date.now() - (index * 3600000)).toISOString()
        }));
        
        setRecentActivity(mockActivity);
        
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [location.key]);
  
  // Stats configuration
  const statsConfig = [
    { 
      id: 1, 
      name: 'Total Projects', 
      value: stats.totalProjects, 
      icon: ClipboardDocumentListIcon, 
      change: '+12%', 
      changeType: 'increase' 
    },
    { 
      id: 2, 
      name: 'Active Tasks', 
      value: stats.activeTasks, 
      icon: CheckCircleIcon, 
      change: '+2.5%', 
      changeType: 'increase' 
    },
    { 
      id: 3, 
      name: 'Tasks This Week', 
      value: stats.tasksThisWeek, 
      icon: ClockIcon, 
      change: '+18%', 
      changeType: 'increase' 
    },
    { 
      id: 4, 
      name: 'Completed', 
      value: stats.completedTasks, 
      icon: ChartBarIcon, 
      change: '+4.3%', 
      changeType: 'increase' 
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, <span className="font-medium text-indigo-600">{user?.name || 'User'}</span>! Here's what's happening with your projects today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/projects/new')}
            className="hidden sm:inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsConfig.map((stat) => (
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
      )}

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
                {isLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <li key={i} className="px-6 py-4">
                      <div className="animate-pulse flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        <div className="ml-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="ml-auto h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </li>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <li key={activity._id} className="px-6 py-4">
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
                          <p className="text-sm text-gray-500">
                            {formatRelativeTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500 text-sm">
                    No recent activity
                  </div>
                )}
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
                onClick={() => {
                  navigate('/projects/new');
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Project
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/tasks/new');
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/jobs/process');
                }}
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