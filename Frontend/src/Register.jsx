
import { useState } from 'react';

function Register({ onLogin }) {
    const initialFormData = {
        name: '',
        email: '',
        password: '',
        role: 'buyer',
        phone: '',
        region: '',
        town: ''
    };

    const [formData, setFormData] = useState(initialFormData);
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
                'http://localhost:3000/api/users/register',
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
                setMessage('Registration successful! Please log in.');
                setFormData(initialFormData);

                if (onLogin) {
                    setTimeout(() => onLogin(), 1000);
                }
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">

                <div className="register-brand">
                    <h2>FarmConnect</h2>
                    <span>Connecting Farmers to Buyers</span>
                </div>

                <div className="register-heading">
                    <h1>Create Your Account</h1>
                    <p>
                        Join FarmConnect and connect directly with farmers
                        and buyers.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">

                    {message && (
                        <div
                            className={`register-message ${
                                message.startsWith('Registration successful')
                                    ? 'success-message'
                                    : 'error-message'
                            }`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}

                    <div className="register-section">
                        <h3>Personal Information</h3>

                        <div className="register-form-group">
                            <label htmlFor="register-name">
                                Full Name
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="register-email">
                                Email Address
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="register-password-wrapper">
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            <small>Password must contain at least 6 characters.</small>
                        </div>
                    </div>

                    <div className="register-section">
                        <h3>Account Information</h3>

                        <div className="register-form-group">
                            <label htmlFor="register-role">
                                Register As
                            </label>

                            <select
                                id="register-role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="Farmer">Farmer</option>
                            </select>
                        </div>
                    </div>

                    <div className="register-section">
                        <h3>Contact and Location</h3>

                        <div className="register-form-group">
                            <label htmlFor="register-phone">
                                Phone Number
                            </label>
                            <input
                                id="register-phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="register-region">
                                Region
                            </label>
                            <input
                                id="register-region"
                                type="text"
                                name="region"
                                placeholder="Enter your region"
                                value={formData.region}
                                onChange={handleChange}
                                autoComplete="address-level1"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="register-town">
                                Town
                            </label>
                            <input
                                id="register-town"
                                type="text"
                                name="town"
                                placeholder="Enter your town"
                                value={formData.town}
                                onChange={handleChange}
                                autoComplete="address-level2"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="register-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="register-login">
                    <p>
                        Already have an account?
                        <button
                            type="button"
                            onClick={onLogin}
                        >
                            Login
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Register;
