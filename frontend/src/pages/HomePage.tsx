import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/projects";
import type { Project } from "../types/project";
import ProjectCard from "../components/projects/ProjectCard";
import PageContainer from "../components/layout/PageContainer";

function HomePage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFeaturedProjects = async () => {
            try {
                const data = await getProjects();

                const featuredProjects = data.filter(
                    project => project.featured
                );

                setProjects(featuredProjects);
            } catch (error) {
                console.error(error);
                setError("Failed to load featured projects.");
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProjects();
    }, []);

    return (
        <PageContainer>
            <section>
                <h1>Hi, I'm Clement.</h1>

                <h2>Software Developer</h2>

                <p>
                    I build web applications and backend systems
                    using modern technologies.
                </p>

                <Link to="/projects">
                    View My Projects
                </Link>
            </section>

            <section>
                <h2>About Me</h2>

                <p>
                    I'm a software developer interested in building
                    reliable and maintainable applications.
                </p>
            </section>

            <section>
                <h2>Featured Projects</h2>

                {loading && (
                    <p>Loading featured projects...</p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {!loading && !error && projects.length === 0 && (
                    <p>No featured projects available.</p>
                )}

                {!loading && !error && projects.length > 0 && (
                    <div className="project-grid">
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                )}

                <Link to="/projects">
                    View All Projects
                </Link>
            </section>

            <section>
                <h2>Technologies</h2>

                <ul>
                    <li>React</li>
                    <li>TypeScript</li>
                    <li>Node.js</li>
                    <li>Express</li>
                    <li>PostgreSQL</li>
                    <li>Prisma</li>
                </ul>
            </section>

            <section>
                <h2>Contact</h2>

                <p>
                    Interested in working together or learning more
                    about my work?
                </p>
            </section>
        </PageContainer>
    );
}

export default HomePage;