import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="centered-container">
            <div className="container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Page Not Found</h2>
                <p className="message mb-6">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <div className="flex justify-center">
                    <Link className='form-button' to="/">Go to Home Page</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
