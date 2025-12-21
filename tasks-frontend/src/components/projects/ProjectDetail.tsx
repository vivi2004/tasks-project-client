// src/pages/projects/ProjectDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import taskApi from '../../api/taskApi';
import { TrashIcon, PencilIcon, CheckCircleIcon, TrashIcon as DeleteIcon } from '@heroicons/react/24/outline';
import type { Project } from '../../types/project.types';
import type { Task } from '../../types/task.types';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskActionId, setTaskActionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is missing');
        setLoading(false);
        return;
      }
      try {
        const data = await projectApi.getProject(id);
        setProject(data);
      } catch (err) {
        setError('Project not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const fetchTasks = async (projectId: string) => {
    try {
      setTasksLoading(true);
      setTasksError('');
      const res = await taskApi.getTasks(projectId, { page: 1, limit: 100 });
      setTasks(res.data);
    } catch (err) {
      setTasksError('Failed to load tasks');
      console.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchTasks(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      setError('Project ID is missing');
      return;
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.deleteProject(id);
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!newTaskTitle.trim()) {
      setTasksError('Task title is required');
      return;
    }

    try {
      setIsCreatingTask(true);
      setTasksError('');

      await taskApi.createTask(id, {
        title: newTaskTitle.trim(),
        status: 'todo',
        dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : undefined,
      });

      setNewTaskTitle('');
      setNewTaskDueDate('');
      await fetchTasks(id);
    } catch (err: any) {
      setTasksError(err?.response?.data?.message || 'Failed to create task');
      console.error(err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleMarkDone = async (taskId: string) => {
    if (!id) return;
    try {
      setTaskActionId(taskId);
      setTasksError('');
      await taskApi.updateTask(id, taskId, { status: 'done' });
      await fetchTasks(id);
    } catch (err: any) {
      setTasksError(err?.response?.data?.message || 'Failed to update task');
      console.error(err);
    } finally {
      setTaskActionId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!id) return;
    if (!window.confirm('Delete this task?')) return;
    try {
      setTaskActionId(taskId);
      setTasksError('');
      await taskApi.deleteTask(id, taskId);
      await fetchTasks(id);
    } catch (err: any) {
      setTasksError(err?.response?.data?.message || 'Failed to delete task');
      console.error(err);
    } finally {
      setTaskActionId(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!project) return <div className="p-6">Project not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/projects"
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          &larr; Back to projects
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {project.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Project details
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/projects/${project._id}/edit`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'on-hold'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.description || 'No description provided.'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(project.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(project.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Tasks</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Create tasks and track progress for this project.</p>
        </div>

        <div className="p-6">
          {tasksError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {tasksError}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <label htmlFor="newTaskTitle" className="sr-only">Task title</label>
              <input
                id="newTaskTitle"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task..."
                disabled={isCreatingTask}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="newTaskDueDate" className="sr-only">Due date</label>
              <input
                id="newTaskDueDate"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                disabled={isCreatingTask}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isCreatingTask}
                className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isCreatingTask ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>

          {tasksLoading ? (
            <div className="text-sm text-gray-600">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-sm text-gray-600">No tasks yet. Add your first task above.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((t) => (
                <li key={t._id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          t.status === 'done'
                            ? 'bg-green-100 text-green-800'
                            : t.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t.status}
                      </span>
                      <p className={`text-sm font-medium ${t.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'} truncate`}>
                        {t.title}
                      </p>
                    </div>
                    {t.dueDate && (
                      <p className="mt-1 text-xs text-gray-500">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status !== 'done' && (
                      <button
                        type="button"
                        onClick={() => handleMarkDone(t._id)}
                        disabled={taskActionId === t._id}
                        className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                        Done
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(t._id)}
                      disabled={taskActionId === t._id}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete task"
                    >
                      <DeleteIcon className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}