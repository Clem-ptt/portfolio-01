import { useEffect, useState } from "react";
import {
    createProject,
    updateProject,
} from "../../api/projects";
import { getTechnologies } from "../../api/technologies";
import type { CreateProject } from "../../types/createproject";
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
        technologyIds: project?.technologies?.map(
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
        <section>
            <h2>
                {project ? "Edit Project" : "Create Project"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="slug">Slug</label>
                    <input
                        id="slug"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="githubUrl">
                        GitHub URL
                    </label>
                    <input
                        id="githubUrl"
                        name="githubUrl"
                        type="url"
                        value={form.githubUrl}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="liveUrl">
                        Live URL
                    </label>
                    <input
                        id="liveUrl"
                        name="liveUrl"
                        type="url"
                        value={form.liveUrl}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        <input
                            name="featured"
                            type="checkbox"
                            checked={form.featured}
                            onChange={handleChange}
                        />
                        Featured
                    </label>
                </div>

                <fieldset>
                    <legend>Technologies</legend>

                    {isLoadingTechnologies ? (
                        <p>Loading technologies...</p>
                    ) : technologies.length === 0 ? (
                        <p>No technologies available.</p>
                    ) : (
                        technologies.map((technology) => (
                            <div key={technology.id}>
                                <label>
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
                                    {technology.name}
                                </label>
                            </div>
                        ))
                    )}
                </fieldset>

                {error && <p role="alert">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting || isLoadingTechnologies}
                >
                    {isSubmitting
                        ? "Saving..."
                        : project
                            ? "Update Project"
                            : "Create Project"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </form>
        </section>
    );
};

export default ProjectForm;