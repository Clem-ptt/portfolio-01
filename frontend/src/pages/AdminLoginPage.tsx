import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

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
        <main>
            <h1>Admin Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
};

export default AdminLoginPage;