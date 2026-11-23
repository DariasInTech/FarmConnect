
import { useState } from 'react';

function Login({ onHome, onRegister, onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(
                'http://localhost:3000/api/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setMessage('Login successful!');

                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
            } else {
                setMessage(data.message || 'Login failed. Please check your details.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-brand">
                    <h2>FarmConnect</h2>
                    <span>Connecting Farmers to Buyers</span>
                </div>

                <div className="login-heading">
                    <h1>Welcome Back!</h1>
                    <p>Login to continue to your FarmConnect account.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">

                    {message && (
                        <div
                            className={`login-message ${
                                message === 'Login successful!'
                                    ? 'success-message'
                                    : 'error-message'
                            }`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}

                    <div className="login-form-group">
                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="login-password">
                            Password
                        </label>

                        <div className="password-input-wrapper">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login to Account'}
                    </button>
                </form>

                <div className="login-register">
                    <p>
                        Don't have an account?
                        <button
                            type="button"
                            onClick={onRegister}
                        >
                            Register
                        </button>
                    </p>
                </div>

                <button
                    type="button"
                    className="login-home-btn"
                    onClick={onHome}
                >
                    Back to Home
                </button>

            </div>
        </div>
    );
}

export default Login;
