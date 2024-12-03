import React, { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HidePassword from '../../assets/HidePassword.svg';
import ShowPassword from '../../assets/ShowPassword.svg';
import '../Signup/SignupPage.css';

const initialState = {
    formData: {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: ''
    },
    showPassword: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FORM_DATA':
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.field]: action.value
                }
            };
        case 'TOGGLE_PASSWORD':
            return { ...state, showPassword: !state.showPassword };
        default:
            return state;
    }
};

function SignupPage({ showPopup }) {
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
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state.formData)
            });

            if (!response.ok) {
                const data = await response.json();
                showPopup(data.message || 'Signup failed, account with these details already exists!', 'error');
            } else {
                showPopup('Signup successful! Redirecting to login...', 'success');
                navigate('/login');
            }
        } catch (err) {
            showPopup('Network error. Please check your connection.', 'error');
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
                        value={state.formData.first_name}
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
                        value={state.formData.last_name}
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
                        value={state.formData.username}
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
                        value={state.formData.email}
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
                <button type="submit" className="signup-button">Sign up</button>
            </form>
            <p className="login-link">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default SignupPage;
