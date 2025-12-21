// src/pages/projects/CreateProject.tsx
import ProjectForm from '../../components/projects/ProjectForm';

export default function CreateProject() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-1 text-sm text-gray-600">Set up a new project to start organizing your work.</p>
        </div>
      </div>

      <ProjectForm showHeader={false} />
    </div>
  );
}