import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HidePassword from '../../assets/HidePassword.svg';
import ShowPassword from '../../assets/ShowPassword.svg';
import '../Signup/SignupPage.css';

function SignupPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Signup failed');
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Error during signup:', err);
            setError('Network error. Please check your connection.');
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                            <img src={showPassword ? ShowPassword : HidePassword} alt="Toggle visibility" />
                        </span>
                    </div>
                </div>
                <button type="submit" className="signup-button">Sign up</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <p className="login-link">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default SignupPage;
