import { useState } from "react";
import {
    createTechnology,
    updateTechnology,
} from "../../api/technologies";
import type {
    CreateTechnology,
    Technology,
    TechnologyCategory,
} from "../../types/technology";

const categories: { value: TechnologyCategory; label: string }[] = [
    { value: "FRONTEND", label: "Frontend" },
    { value: "BACKEND", label: "Backend" },
    { value: "DATABASE", label: "Database" },
    { value: "DEVOPS", label: "DevOps" },
    { value: "TOOLS", label: "Tools" },
    { value: "OTHER", label: "Other" },
];

type TechnologyFormProps = {
    technology?: Technology;
    onSaved: () => void;
    onCancel: () => void;
};

const TechnologyForm = ({
    technology,
    onSaved,
    onCancel,
}: TechnologyFormProps) => {
    const [form, setForm] = useState<CreateTechnology>({
        name: technology?.name ?? "",
        iconUrl: technology?.iconUrl ?? "",
        category: technology?.category ?? "OTHER",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const formData: CreateTechnology = {
                name: form.name.trim(),
                iconUrl: form.iconUrl?.trim() || undefined,
                category: form.category,
            };

            if (technology) {
                await updateTechnology(technology.id, formData);
            } else {
                await createTechnology(formData);
            }

            onSaved();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to save technology."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section>
            <h2>
                {technology
                    ? "Edit Technology"
                    : "Create Technology"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="technology-name">
                        Technology Name
                    </label>
                    <input
                        id="technology-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. React"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="technology-icon-url">
                        Icon URL
                    </label>
                    <input
                        id="technology-icon-url"
                        name="iconUrl"
                        type="url"
                        value={form.iconUrl ?? ""}
                        onChange={handleChange}
                        placeholder="Paste a Devicon SVG URL"
                    />
                </div>

                {form.iconUrl && (
                    <div>
                        <p>Icon Preview</p>
                        <img
                            src={form.iconUrl}
                            alt={`${form.name || "Technology"} icon preview`}
                            width={48}
                            height={48}
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="technology-category">
                        Category
                    </label>
                    <select
                        id="technology-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <p role="alert">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Saving..."
                        : technology
                            ? "Update Technology"
                            : "Create Technology"}
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

export default TechnologyForm;