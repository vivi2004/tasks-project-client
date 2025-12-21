// src/components/projects/ProjectForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';

import type { Project, ProjectInput } from '../../types/project.types';

type ProjectFormProps = {
  project?: Project | null;
  showHeader?: boolean;
};

export default function ProjectForm({ project = null, showHeader = true }: ProjectFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectInput>({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as ProjectInput));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (project) {
        await projectApi.updateProject(project._id, formData);
      } else {
        await projectApi.createProject(formData);
      }

      navigate('/projects');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {project ? 'Update your project details.' : 'Fill in the details below to create a new project.'}
          </p>
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg">
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Website Redesign"
                  required
                  autoFocus={!project}
                />
              </div>

              <div className="md:col-span-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Optional: What is this project about?"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting
                  ? project
                    ? 'Saving...'
                    : 'Creating...'
                  : project
                  ? 'Save Changes'
                  : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}