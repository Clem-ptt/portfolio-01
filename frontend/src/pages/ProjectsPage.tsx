import { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import type { Project } from "../types/project";
import ProjectCard from "../components/ProjectCard";

function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    if (loading) {
        return <h1>Loading projects...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <main>
            <h1>My Projects</h1>

            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                projects.map(project => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                    />
                ))
            )}
        </main>
    );
}

export default ProjectsPage;