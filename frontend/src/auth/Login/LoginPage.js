import React, { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/LoginPage.css';
import SplashScreen from '../../utils/SplashScreen/SplashScreen';
import HidePassword from '../../assets/HidePassword.svg';
import ShowPassword from '../../assets/ShowPassword.svg';

const initialState = {
    formData: {
        identifier: '',
        password: ''
    },
    showPassword: false,
    showSplash: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FORM_DATA':
            return {
                ...state, formData: {
                    ...state.formData,
                    [action.field]: action.value
                }
            };
        case 'TOGGLE_PASSWORD':
            return { ...state, showPassword: !state.showPassword };
        case 'SHOW_SPLASH':
            return { ...state, showSplash: true };
        case 'HIDE_SPLASH':
            return { ...state, showSplash: false };
        default: return state;
    }
};

function LoginPage({ showPopup }) {

    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FORM_DATA', field: name, value });
    };

    const togglePasswordVisibility = () => {
        dispatch({ type: 'TOGGLE_PASSWORD' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state.formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', data.username);
                window.dispatchEvent(new Event('storage'));
                dispatch({ type: 'SHOW_SPLASH' });
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPLASH' });
                    navigate('/');
                }, 4000);
                showPopup('Login successful!', 'success');
            } else {
                showPopup('Login failed! Invalid username or password', 'error');
            }
        } catch (err) {
            showPopup('An error occurred. Please try again.', 'error');
        }
    };

    return (
        <div>
            {state.showSplash ? (
                <SplashScreen />
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
                                value={state.formData.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <input
                                    type={state.showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={state.formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                                    <img src={state.showPassword ? ShowPassword : HidePassword} alt="Toggle visibility" />
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="login-button">Log In</button>
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
