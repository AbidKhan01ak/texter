import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../NavBar/NavBar.css';
import LoggedInImg from '../../assets/loggedIn.svg';

function NavBar({ scrollToOperations, scrollToHeader, scrollToFooter }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {

            const token = localStorage.getItem('token');
            const storedUsername = localStorage.getItem('username');
            setIsLoggedIn(!!token);
            setUsername(storedUsername || '');
        };
        window.addEventListener('storage', checkLoginStatus);
        checkLoginStatus();

        return () => window.removeEventListener('storage', checkLoginStatus)
    }, [isLoggedIn]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/login');
    };

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);
    };

    const handleClickOutside = useCallback((e) => {
        if (e.target.closest('.user-info') === null) {
            setShowDropdown(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [handleClickOutside]);

    const handleScrollNavigation = (scrollFunction) => {
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(scrollFunction, 100);
        } else {
            scrollFunction();
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <a href='#home' onClick={(e) => {
                    e.preventDefault();
                    handleScrollNavigation(scrollToHeader);
                }}>
                    <img src="/assets/appLogo/appLogo.svg" alt="Logo" className="nav-logo" />
                </a>
                <ul className="nav-links">
                    <li><a href="#home" onClick={(e) => {
                        e.preventDefault();
                        handleScrollNavigation(scrollToHeader);
                    }}><img src="/assets/NavBarLogo/HomeLogo.svg" alt="logo" />Home</a></li>
                    <li><a href="#features" onClick={(e) => {
                        e.preventDefault();
                        handleScrollNavigation(scrollToOperations);
                    }}><img src="/assets/NavBarLogo/FeaturesLogo.svg" alt="logo" />Features</a></li>
                    <li><a href="#contact" onClick={(e) => {
                        e.preventDefault();
                        handleScrollNavigation(scrollToFooter);
                    }}><img src="/assets/NavBarLogo/ContactLogo.svg" alt="logo" />Contact</a></li>
                </ul>
            </div>
            <div className="nav-right">
                {isLoggedIn ? (
                    <div className="user-info" onClick={toggleDropdown}>
                        <span className="username">{username}</span>
                        <img src={LoggedInImg} alt="User Icon" className="user-icon" />
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <p>{username}</p>
                                <div className="dropdown-divider"></div>
                                <button onClick={() => navigate('/history')}>History</button>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <img src="/assets/NavBarLogo/LoginLogo.svg" alt='logo' />Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
