import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import JobDetail from "../pages/JobDetail";
import ProcessFile from "../pages/ProcessFile";
import Profile from "../pages/Profile";
import ProjectList from "../components/projects/ProjectList";
import ProjectDetail from "../components/projects/ProjectDetail";
import CreateProject from "../components/projects/CreateProject";
import EditProject from "../components/projects/EditProject";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/projects",
            element: <ProjectList />,
          },
          {
            path: "/jobs",
            element: <Jobs />,
          },
          {
            path: "/jobs/process",
            element: <ProcessFile />,
          },
          {
            path: "/jobs/:id",
            element: <JobDetail />,
          },
          {
            path: "/projects/new",
            element: <CreateProject />,
          },
          {
            path: "/projects/:id",
            element: <ProjectDetail />,
          },
          {
            path: "/projects/:id/edit",
            element: <EditProject />,
          },
        ],
      },
    ],
  },
]);