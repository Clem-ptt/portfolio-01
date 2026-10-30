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
import Toast, { type ToastType } from "../ui/Toast";

const categories: { value: TechnologyCategory; label: string }[] = [
    { value: "PROGRAMMING_LANGUAGES", label: "Programming Languages" },
    { value: "FRONTEND", label: "Frontend" },
    { value: "BACKEND", label: "Backend" },
    { value: "DATABASE", label: "Database" },
    { value: "CLOUD_DEVOPS", label: "Cloud & DevOps" },
    { value: "TOOLS", label: "Tools" },
    { value: "AI_AUTOMATION", label: "AI & Automation" },
    { value: "SECURITY_INFRASTRUCTURE", label: "Security & Infrastructure" },
    { value: "DESIGN", label: "Design" },
    { value: "TESTING_QA", label: "Testing & QA" },
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [toast, setToast] = useState<{
        type: ToastType;
        message: string;
    } | null>(null);

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
        setIsSubmitting(true);

        try {
            const formData: CreateTechnology = {
                name: form.name.trim(),
                iconUrl: form.iconUrl?.trim() || undefined,
                category: form.category,
            };

            if (technology) {
                await updateTechnology(technology.id, formData);

                setToast({
                    type: "success",
                    message: "Technology updated successfully.",
                });
            } else {
                await createTechnology(formData);
                setToast({
                    type: "success",
                    message: "Technology created successfully.",
                });
            }

            onSaved();
        } catch (error) {
            setToast({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to save technology.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form
                id="technology-form"
                className="technology-form"
                onSubmit={handleSubmit}
            >
                <div className="technology-form-body">
                    <div className="technology-form-field">
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

                    <div className="technology-form-field">
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
                        <p className="technology-form-hint">
                            Optional. Use a direct URL to the technology icon.
                        </p>
                    </div>

                    {form.iconUrl && (
                        <div className="technology-icon-preview">
                            <p>Icon Preview</p>
                            <div className="technology-icon-preview-box">
                                <img
                                    src={form.iconUrl}
                                    alt={`${form.name || "Technology"} icon preview`}
                                    width={48}
                                    height={48}
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="technology-form-field">
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
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <footer className="technology-form-footer">
                    <button
                        className="admin-secondary-button"
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        className="admin-primary-button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Saving..."
                            : technology
                                ? "Update Technology"
                                : "Create Technology"}
                    </button>
                </footer>
            </form>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default TechnologyForm;