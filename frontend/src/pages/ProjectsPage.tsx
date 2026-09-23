import { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import type { Project } from "../types/project";
import ProjectCard from "../components/projects/ProjectCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

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
        return (
            <>
                <h1>Projects</h1>

                <LoadingState message="Loading projects..." />
            </>
        );
    }

    if (error) {
        return (
            <>
                <h1>Projects</h1>
                <ErrorState message={error} />
            </>
        );
    }

    return (
        <>
            <section>
                <h1>Projects</h1>

                <p>
                    A collection of applications and projects
                    I've built while developing my skills.
                </p>
            </section>

            <section>
                {projects.length === 0 ? (
                    <EmptyState message="No projects available." />
                ) : (
                    <div>
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default ProjectsPage;