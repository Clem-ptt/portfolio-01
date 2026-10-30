import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../api/projects";
import { getTechnologies } from "../api/technologies";
import type { Project } from "../types/project";
import type { Technology } from "../types/technology";
// import type { ContactForm } from "../types/contactform";
import ProjectCard from "../components/projects/ProjectCard";
import PageContainer from "../components/layout/PageContainer";
import TechnologyCard from "../components/technologies/TechnologyCard";
import Toast, { type ToastType } from "../components/ui/Toast";

function HomePage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);

    const [isProjLoading, setIsProjLoading] = useState(true);
    const [isTechLoading, setIsTechLoading] = useState(true);

    const [projError, setProjError] = useState<string | null>(null);
    const [techError, setTechError] = useState<string | null>(null);

    // const [contactForm, setContactForm] = useState<ContactForm>({
    //     name: "",
    //     email: "",
    //     subject: "",
    //     message: "",
    // });

    // const [contactError, setContactError] = useState("");
    const [toast, setToast] = useState<{
        type: ToastType;
        message: string;
    } | null>(null);

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

    // const handleContactChange = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    // ) => {
    //     const { name, value } = event.target;

    //     setContactForm((currentForm) => ({
    //         ...currentForm,
    //         [name]: value,
    //     }));

    //     if (contactError) {
    //         setContactError("");
    //     }
    // };

    // const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     setToast({
    //         type: "error",
    //         message: "The contact form isn't connected yet. Your message hasn't been sent.",
    //     });
    // };

    return (
        <PageContainer>
            <section className="hero-section">
                <p className="hero-eyebrow">SOFTWARE DEVELOPER</p>

                <h1>
                    Hi, I'm Clement.
                    <br />
                    <span>I build for the web.</span>
                </h1>

                <p className="hero-description">
                    I build web applications and backend systems with a focus
                    on reliable functionality, maintainable code, and practical
                    solutions.
                </p>

                <div className="hero-actions">
                    <Link to="/projects" className="hero-primary-action">
                        Explore My Projects <span aria-hidden="true">↗</span>
                    </Link>

                    {/* <a href="#about" className="hero-secondary-action">
                        More About Me
                    </a> */}
                </div>
            </section>

            <section id="about" className="content-section">
                <p className="section-eyebrow">INTRODUCTION</p>
                <h2>About Me</h2>

                <p className="text-justify">
                    I'm a Software Engineer who enjoys turning ideas and requirements into practical, 
                    reliable software. With nearly 3 years of professional experience, I've worked on 
                    business applications where functionality, maintainability, and user needs play 
                    an important role.

                    My experience includes contributing to an ERP SaaS platform, developing and 
                    maintaining features across different business modules, and working with systems 
                    that support day-to-day business operations.

                    I approach development with a focus on understanding problems before building 
                    solutions. I value thoughtful technical decisions, maintainable code, and continuous 
                    learning, while always looking for opportunities to improve the software I build 
                    and the way I build it.
                </p>
            </section>

            <section className="content-section">
                <p className="section-eyebrow">SELECTED WORK</p>
                <h2>Featured Projects</h2>

                {isProjLoading && <p>Loading featured projects...</p>}
                {projError && <p role="alert">{projError}</p>}

                {!isProjLoading && !projError && projects.length === 0 && (
                    <p>No featured projects available.</p>
                )}

                {!isProjLoading && !projError && projects.length > 0 && (
                    <div className="project-grid">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}

                <Link to="/projects" className="section-action">
                    View All Projects <span aria-hidden="true">→</span>
                </Link>
            </section>

            <section className="content-section">
                <p className="section-eyebrow">MY TOOLKIT</p>
                <h2>Technologies</h2>

                {isTechLoading && <p>Loading technologies...</p>}
                {techError && <p role="alert">{techError}</p>}

                {!isTechLoading && !techError && technologies.length === 0 && (
                    <p>No technologies available.</p>
                )}

                {!isTechLoading && !techError && technologies.length > 0 && (
                    <div className="technology-grid">
                        {technologies.map((technology) => (
                            <TechnologyCard
                                key={technology.id}
                                technology={technology}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="content-section contact-section">
                <p className="section-eyebrow">GET IN TOUCH</p>
                <h2>Let's connect.</h2>

                <p>
                    Interested in my work or have a project to discuss?
                    I'd be glad to hear from you.
                </p>

                {/* <form className="contact-form" onSubmit={handleContactSubmit}>
                    <div className="contact-form-field">
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Your name"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="contact-form-field">
                        <label htmlFor="contact-email">Email</label>
                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            maxLength={254}
                            required
                        />
                    </div>

                    <div className="contact-form-field">
                        <label htmlFor="contact-subject">Subject</label>
                        <input
                            id="contact-subject"
                            name="subject"
                            type="text"
                            placeholder="What would you like to discuss?"
                            value={contactForm.subject}
                            onChange={handleContactChange}
                            maxLength={150}
                            required
                        />
                    </div>

                    <div className="contact-form-field">
                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            placeholder="Write your message here..."
                            rows={6}
                            value={contactForm.message}
                            onChange={handleContactChange}
                            maxLength={5000}
                            required
                        />
                    </div>

                    {contactError && (
                        <p className="contact-form-error" role="alert">
                            {contactError}
                        </p>
                    )}

                    <button type="submit" className="contact-form-submit">
                        Send Message <span aria-hidden="true">↗</span>
                    </button>
                </form> */}
            </section>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </PageContainer>
    );
}

export default HomePage;