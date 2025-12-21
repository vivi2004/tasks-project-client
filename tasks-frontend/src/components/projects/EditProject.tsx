// src/pages/projects/EditProject.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projectApi } from '../../api/projectApi';
import ProjectForm from '../../components/projects/ProjectForm';
import type { Project } from '../../types/project.types';

export default function EditProject() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('Failed to load project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return <ProjectForm project={project} />;
}