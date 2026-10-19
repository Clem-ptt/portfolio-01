
import { useCallback, useEffect, useState } from "react";
import {
    getTechnologies,
    deleteTechnology,
} from "../api/technologies";
import type { Technology } from "../types/technology";
import TechnologyForm from "../components/technologies/TechnologyForm";
import TechnologyCard from "../components/technologies/TechnologyCard";

const AdminTechnologiesPage = () => {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [editingTechnology, setEditingTechnology] =
        useState<Technology | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTechnologies = useCallback(async () => {
        try {
            setError("");
            const data = await getTechnologies();
            setTechnologies(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load technologies."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchTechnologies = async () => {
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
                    setIsLoading(false);
                }
            }
        };

        void fetchTechnologies();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreate = () => {
        setEditingTechnology(null);
        setIsFormOpen(true);
    };

    const handleEdit = (technology: Technology) => {
        setEditingTechnology(technology);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTechnology(null);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this technology?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");

            await deleteTechnology(id);
            await loadTechnologies();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete technology."
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return <p>Loading technologies...</p>;
    }

    if (error && technologies.length === 0) {
        return (
            <main>
                <p role="alert">{error}</p>
                <button type="button" onClick={() => void loadTechnologies()}>
                    Retry
                </button>
            </main>
        );
    }

    return (
        <main>
            <h1>Technologies</h1>

            <button type="button" onClick={handleCreate}>
                Create Technology
            </button>

            {error && <p role="alert">{error}</p>}

            {technologies.length === 0 ? (
                <p>No technologies found.</p>
            ) : (
                <ul>
                    {technologies.map((technology) => (
                        <li key={technology.id}>
                            <TechnologyCard
                                technology={technology}
                                showAdminActions
                                onEdit={() => handleEdit(technology)}
                                onDelete={() => void handleDelete(technology.id)}
                            />

                            {deletingId === technology.id && (
                                <p>Deleting...</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {isFormOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="technology-form-title"
                >
                    <div>
                        <h2 id="technology-form-title">
                            {editingTechnology
                                ? "Edit Technology"
                                : "Create Technology"}
                        </h2>

                        <TechnologyForm
                            technology={editingTechnology ?? undefined}
                            onSaved={async () => {
                                handleCloseForm();
                                await loadTechnologies();
                            }}
                            onCancel={handleCloseForm}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminTechnologiesPage;
