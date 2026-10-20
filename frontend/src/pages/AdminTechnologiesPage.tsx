import { useCallback, useEffect, useState } from "react";
import {
    getTechnologies,
    deleteTechnology,
} from "../api/technologies";
import type { Technology } from "../types/technology";
import TechnologyForm from "../components/technologies/TechnologyForm";
import TechnologyCard from "../components/technologies/TechnologyCard";
import PageContainer from "../components/layout/PageContainer";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import BackButton from "../components/ui/BackButton";

const AdminTechnologiesPage = () => {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [editingTechnology, setEditingTechnology] =
        useState<Technology | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [technologyToDelete, setTechnologyToDelete] =
        useState<Technology | null>(null);

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

    const handleDelete = async () => {
        if (!technologyToDelete) {
            return;
        }

        const technologyId = technologyToDelete.id;

        try {
            setDeletingId(technologyId);
            setError("");

            await deleteTechnology(technologyId);

            setTechnologies((current) =>
                current.filter((technology) => technology.id !== technologyId)
            );

            setTechnologyToDelete(null);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete technology."
            );
            setTechnologyToDelete(null);
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <div className="admin-state">
                    <p>Loading technologies...</p>
                </div>
            </PageContainer>
        );
    }

    if (error && technologies.length === 0) {
        return (
            <PageContainer>
                <div className="admin-state" role="alert">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => void loadTechnologies()}
                    >
                        Try Again
                    </button>
                </div>
            </PageContainer>
        );
    }

    return (
        <>
            <div className="page-back-navigation">
                <BackButton
                    label="Back to Dashboard"
                    to="/admin"
                />
            </div>

            <PageContainer>
                <main className="admin-technologies-page">
                    <header className="admin-page-header">
                        <div>
                            <p className="section-eyebrow">
                                PORTFOLIO MANAGEMENT
                            </p>
                            <h1>Technologies</h1>
                            <p className="admin-page-description">
                                Manage the technologies and tools displayed
                                throughout your portfolio.
                            </p>
                        </div>

                        <button
                            className="admin-primary-button"
                            type="button"
                            onClick={handleCreate}
                        >
                            <span aria-hidden="true">+</span> Create Technology
                        </button>
                    </header>

                    {error && (
                        <p className="admin-form-error" role="alert">
                            {error}
                        </p>
                    )}

                    <section className="admin-technologies-section">
                        <div className="admin-list-heading">
                            <h2>All Technologies</h2>
                            <span className="admin-count">
                                {technologies.length}{" "}
                                {technologies.length === 1
                                    ? "technology"
                                    : "technologies"}
                            </span>
                        </div>

                        {technologies.length === 0 ? (
                            <div className="admin-empty-state">
                                <h3>No technologies yet</h3>
                                <p>
                                    Add your first technology to showcase the
                                    tools and skills you work with.
                                </p>
                                <button
                                    className="admin-primary-button"
                                    type="button"
                                    onClick={handleCreate}
                                >
                                    Create Your First Technology
                                </button>
                            </div>
                        ) : (
                            <ul className="admin-technology-list">
                                {technologies.map((technology) => (
                                    <li key={technology.id}>
                                        <TechnologyCard
                                            technology={technology}
                                            showAdminActions
                                            onEdit={() => handleEdit(technology)}
                                            onDelete={() =>
                                                setTechnologyToDelete(technology)
                                            }
                                        />

                                        {deletingId === technology.id && (
                                            <p className="admin-inline-status">
                                                Deleting technology...
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {isFormOpen && (
                        <div
                            className="admin-dialog-backdrop"
                            role="presentation"
                        >
                            <section
                                className="admin-dialog technology-form-dialog"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="technology-form-title"
                            >
                                <header className="admin-dialog-header">
                                    <div>
                                        <h2 id="technology-form-title">
                                            {editingTechnology
                                                ? "Edit Technology"
                                                : "Create Technology"}
                                        </h2>
                                    </div>
                                </header>

                                <TechnologyForm
                                    technology={editingTechnology ?? undefined}
                                    onSaved={async () => {
                                        handleCloseForm();
                                        await loadTechnologies();
                                    }}
                                    onCancel={handleCloseForm}
                                />
                            </section>
                        </div>
                    )}

                    {technologyToDelete && (
                        <ConfirmDialog
                            title="Delete Technology?"
                            message={`Are you sure you want to delete "${technologyToDelete.name}"? This action cannot be undone.`}
                            isLoading={deletingId !== null}
                            onConfirm={() => void handleDelete()}
                            onCancel={() => {
                                if (deletingId === null) {
                                    setTechnologyToDelete(null);
                                }
                            }}
                        />
                    )}
                </main>
            </PageContainer>
        </>
    );
};

export default AdminTechnologiesPage;