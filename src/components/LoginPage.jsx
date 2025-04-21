import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

    const navigate = useNavigate();

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                // Login logic
                const response = await axios.post("https://e-commerce-api-i2ak.onrender.com/auth/signin", {
                    email,
                    password,
                });

                console.log("Login successful:", response.data);
                localStorage.setItem("token", response.data.jwt);

                // Update authentication state
                setIsAuthenticated(true);

                // Navigate to homepage
                navigate("/");

                // Clear form
                setEmail("");
                setPassword("");
            } else {
                // Sign Up logic
                const response = await axios.post("https://e-commerce-api-i2ak.onrender.com/auth/signup", {
                    fullName,
                    email,
                    password,
                });

                console.log("Signup successful:", response.data);

                // Switch to login form after successful signup
                setIsLogin(true);
                setFullName("");
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/"); // Redirect to homepage or login page
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(""); // Clear any existing errors when toggling
    };

    return (
        <div className="flex items-center justify-center h-screen mx-auto max-w-[1400px]">
            {isAuthenticated ? (
                <div className="flex flex-col shadow-md items-center h-[400px] w-[440px] rounded-[12px] bg-white">
                    <h3 className="text-black text-[1.5rem] my-[30px]">Welcome!</h3>
                    <button
                        onClick={handleLogout}
                        className="h-[46px] cursor-pointer w-[310px] block mx-auto rounded-[5px] bg-[#4c64fd] text-white hover:bg-amber-500 active:bg-amber-500"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col shadow-md items-center h-[400px] w-[440px] rounded-[12px] bg-white">
                    <h3 className="text-black text-[1.5rem] my-[30px]">{isLogin ? "Login" : "Sign Up"}</h3>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {!isLogin && (
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="text-[1.1rem] w-[310px] p-[10px] mb-[12px] outline-none border-[1px] border-gray-400 rounded-[6px]"
                            type="text"
                            placeholder="Full Name"
                            required
                        />
                    )}

                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-[1.1rem] w-[310px] p-[10px] mb-[12px] outline-none border-[1px] border-gray-400 rounded-[6px]"
                        type="email"
                        placeholder="Email"
                        required
                    />

                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-[1.1rem] w-[310px] p-[10px] mb-[12px] outline-none border-[1px] border-gray-400 rounded-[6px]"
                        type="password"
                        placeholder="Password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-[46px] cursor-pointer w-[310px] block mx-auto rounded-[5px] bg-[#4c64fd] text-white hover:bg-amber-500 active:bg-amber-500 disabled:bg-gray-400"
                    >
                        {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
                    </button>

                    <span
                        onClick={toggleForm}
                        className="h-[46px] cursor-pointer w-[310px] mt-[10px] mx-auto rounded-[5px] bg-[#4c64fd] text-white flex justify-center items-center hover:bg-amber-500 active:bg-amber-500 hover:text-white"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </span>
                </form>
            )}
        </div>
    );
};

export default LoginPage;