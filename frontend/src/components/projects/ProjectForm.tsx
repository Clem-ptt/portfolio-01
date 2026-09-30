import { useState } from "react";
import {
    createProject,
    updateProject,
} from "../../api/projects";
import type { CreateProject } from "../../types/createproject";
import type { Project } from "../../types/project";

type ProjectFormProps = {
    project?: Project;
    onSaved: () => void;
};

const ProjectForm = ({
    project,
    onSaved,
}: ProjectFormProps) => {
    const [form, setForm] = useState<CreateProject>({
        title: project?.title ?? "",
        slug: project?.slug ?? "",
        description: project?.description ?? "",
        imageUrl: project?.imageUrl ?? "",
        githubUrl: project?.githubUrl ?? "",
        liveUrl: project?.liveUrl ?? "",
        featured: project?.featured ?? false,
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            if (project) {
                await updateProject(project.id, form);
            } else {
                await createProject(form);
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
                    <label htmlFor="imageUrl">
                        Image URL
                    </label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={form.imageUrl}
                        onChange={handleChange}
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

                {error && <p>{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Saving..."
                        : project
                            ? "Update Project"
                            : "Create Project"}
                </button>
            </form>
        </section>
    );
};

export default ProjectForm;