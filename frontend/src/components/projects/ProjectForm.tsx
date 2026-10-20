import { useEffect, useState } from "react";
import {
    createProject,
    updateProject,
} from "../../api/projects";
import { getTechnologies } from "../../api/technologies";
import type { CreateProject } from "../../types/project";
import type { Project } from "../../types/project";
import type { Technology } from "../../types/technology";

type ProjectFormProps = {
    project?: Project;
    onSaved: () => void;
    onCancel: () => void;
};

const ProjectForm = ({
    project,
    onSaved,
    onCancel,
}: ProjectFormProps) => {
    const [form, setForm] = useState<CreateProject>({
        title: project?.title ?? "",
        slug: project?.slug ?? "",
        description: project?.description ?? "",
        imageUrl: project?.imageUrl ?? "",
        githubUrl: project?.githubUrl ?? "",
        liveUrl: project?.liveUrl ?? "",
        featured: project?.featured ?? false,
        technologyIds:
            project?.technologies?.map(
                (technology) => technology.id
            ) ?? [],
    });

    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingTechnologies, setIsLoadingTechnologies] =
        useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadTechnologies = async () => {
            try {
                const data = await getTechnologies();

                if (!cancelled) {
                    setTechnologies(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load technologies."
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingTechnologies(false);
                }
            }
        };

        void loadTechnologies();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = event.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? (event.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleTechnologyChange = (technologyId: number) => {
        setForm((current) => {
            const selectedIds = current.technologyIds ?? [];

            return {
                ...current,
                technologyIds: selectedIds.includes(technologyId)
                    ? selectedIds.filter((id) => id !== technologyId)
                    : [...selectedIds, technologyId],
            };
        });
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const formData: CreateProject = {
                ...form,
                title: form.title.trim(),
                slug: form.slug.trim(),
                description: form.description.trim(),
                imageUrl: form.imageUrl || undefined,
                githubUrl: form.githubUrl || undefined,
                liveUrl: form.liveUrl || undefined,
                technologyIds: form.technologyIds ?? [],
            };

            if (project) {
                await updateProject(project.id, formData);
            } else {
                await createProject(formData);
            }

            onSaved();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save project."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="project-form">
            <form
                id="project-form"
                onSubmit={handleSubmit}
                className="project-form-body"
            >
                <div className="project-form-grid">
                    <div className="project-form-field">
                        <label htmlFor="title">Project Title</label>
                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Portfolio Website"
                            required
                        />
                    </div>

                    <div className="project-form-field">
                        <label htmlFor="slug">URL Slug</label>
                        <input
                            id="slug"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            placeholder="e.g. portfolio-website"
                            required
                        />
                        <span className="project-form-hint">
                            Used in the project's public URL.
                        </span>
                    </div>

                    <div className="project-form-field project-form-field-full">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the project, its purpose, and what you built."
                            rows={5}
                            required
                        />
                    </div>

                    <div className="project-form-field">
                        <label htmlFor="githubUrl">GitHub URL</label>
                        <input
                            id="githubUrl"
                            name="githubUrl"
                            type="url"
                            value={form.githubUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                        />
                    </div>

                    <div className="project-form-field">
                        <label htmlFor="liveUrl">Live Demo URL</label>
                        <input
                            id="liveUrl"
                            name="liveUrl"
                            type="url"
                            value={form.liveUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <fieldset className="project-form-featured">
                    <legend>Project Visibility</legend>
                    <label className="project-form-checkbox">
                        <input
                            name="featured"
                            type="checkbox"
                            checked={form.featured}
                            onChange={handleChange}
                        />
                        <span>
                            <strong>Featured project</strong>
                            <small>
                                Highlight this project on the homepage.
                            </small>
                        </span>
                    </label>
                </fieldset>

                <fieldset className="project-form-technologies">
                    <legend>Technologies</legend>
                    <p className="project-form-section-hint">
                        Select the technologies used in this project.
                    </p>

                    {isLoadingTechnologies ? (
                        <p className="project-form-status">
                            Loading technologies...
                        </p>
                    ) : technologies.length === 0 ? (
                        <p className="project-form-status">
                            No technologies available. Add technologies
                            from the admin Technologies page first.
                        </p>
                    ) : (
                        <div className="project-form-technology-list">
                            {technologies.map((technology) => (
                                <label
                                    className="project-form-technology-option"
                                    key={technology.id}
                                >
                                    <input
                                        type="checkbox"
                                        checked={(
                                            form.technologyIds ?? []
                                        ).includes(technology.id)}
                                        onChange={() =>
                                            handleTechnologyChange(
                                                technology.id
                                            )
                                        }
                                    />
                                    <span>{technology.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </fieldset>

                {error && (
                    <p className="project-form-error" role="alert">
                        {error}
                    </p>
                )}
            </form>

            <footer className="project-form-footer">
                <button
                    className="project-form-cancel"
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>

                <button
                    className="project-form-submit"
                    type="submit"
                    form="project-form"
                    disabled={isSubmitting || isLoadingTechnologies}
                >
                    {isSubmitting
                        ? "Saving..."
                        : project
                            ? "Save Changes"
                            : "Create Project"}
                </button>
            </footer>
        </section>
    );
};

export default ProjectForm;