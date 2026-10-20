import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import PageContainer from "../components/layout/PageContainer";

const AdminLoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await login({
                email,
                password,
            });

            navigate("/admin");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Login failed."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <PageContainer>
                <section
                    className="admin-login-card"
                    aria-labelledby="admin-login-title"
                >
                    <div className="admin-login-heading">
                        <span className="section-eyebrow">
                            Restricted Access
                        </span>
                        <h1 id="admin-login-title">Admin Login</h1>
                        <p>
                            Sign in to manage your projects and technologies.
                        </p>
                    </div>

                    <form
                        className="admin-login-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="admin-login-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="admin-login-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <p className="admin-login-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            className="admin-login-submit"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Sign In"}
                            {!isLoading && (
                                <span aria-hidden="true">→</span>
                            )}
                        </button>
                    </form>

                    <p className="admin-login-footer">
                        Authorized administrators only.
                    </p>
                </section>
            </PageContainer>
        </main>
    );
};

export default AdminLoginPage;