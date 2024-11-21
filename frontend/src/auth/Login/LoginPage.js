import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/LoginPage.css';
import SplashScreen from '../../utils/SplashScreen/SplashScreen';
import HidePassword from '../../assets/HidePassword.svg';
import ShowPassword from '../../assets/ShowPassword.svg';

function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',  // Updated to a single identifier field
        password: ''
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showSplash, setShowSplash] = useState(false);
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
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', data.username);
                window.dispatchEvent(new Event('storage'));
                setShowSplash(true);  // Show splash screen
                setTimeout(() => {
                    setShowSplash(false);
                    navigate('/');
                }, 3000);
            } else {
                setError('Login failed! Invalid username or password');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            {showSplash ? (
                <SplashScreen />  // Show splash screen if `showSplash` is true
            ) : (
                <div className="login-container">
                    <h2>Welcome Back</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="identifier">Email or Username</label>
                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                value={formData.identifier}
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
                        <button type="submit" className="login-button">Log In</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                    <p className="signup-link">
                        Don’t have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
