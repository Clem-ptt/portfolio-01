import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../api/projects";
import { getTechnologies } from "../api/technologies";
import type { Project } from "../types/project";
import type { Technology } from "../types/technology";
import ProjectCard from "../components/projects/ProjectCard";
import PageContainer from "../components/layout/PageContainer";
import TechnologyCard from "../components/technologies/TechnologyCard";

function HomePage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);

    const [isProjLoading, setIsProjLoading] = useState(true);
    const [isTechLoading, setIsTechLoading] = useState(true);

    const [projError, setProjError] = useState<string | null>(null);
    const [techError, setTechError] = useState<string | null>(null);

    useEffect(() => {
        const loadFeaturedProjects = async () => {
            try {
                const data = await getFeaturedProjects();

                setProjects(data);
            } catch (error) {
                console.error(error);
                setProjError("Failed to load featured projects.");
            } finally {
                setIsProjLoading(false);
            }
        };

        loadFeaturedProjects();
    }, []);

    useEffect(() => {
        const loadTechnologies = async () => {
            try {
                const data = await getTechnologies();

                setTechnologies(data);
            } catch (error) {
                console.error(error);
                setTechError("Failed to load technologies.");
            } finally {
                setIsTechLoading(false);
            }
        };

        loadTechnologies();
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

                {isProjLoading && (
                    <p>Loading featured projects...</p>
                )}

                {projError && (
                    <p>{projError}</p>
                )}

                {!isProjLoading && !projError && projects.length === 0 && (
                    <p>No featured projects available.</p>
                )}

                {!isProjLoading && !projError && projects.length > 0 && (
                    <div className="project-grid">
                        {projects.map((project) => (
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

                {isTechLoading && (
                    <p>Loading technologies...</p>
                )}

                {techError && (
                    <p>{techError}</p>
                )}

                {!isTechLoading && !techError && technologies.length === 0 && (
                    <p>No technologies available.</p>
                )}

                {!isTechLoading && !techError && technologies.length > 0 && (
                    <div className="technology-grid">
                        {technologies.map((tech) => (
                            <TechnologyCard
                                key={tech.id}
                                technology={tech}
                            />
                        ))}
                    </div>
                )}
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
