import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';


const NotFound = () => {
    return (
        <Fragment>
            <Helmet>
                <title>Note App — 404 Not Found</title>
                <meta
                    name="description"
                    content="Oops! The page you’re looking for doesn’t exist."
                />
                <link rel="canonical" href="https://noteapp.netlify.app/404" />
            </Helmet>
            <div className="notfound-container">
                <h1 className="notfound-title">404</h1>
                <p className="notfound-subtitle">Oops! Page not found.</p>
                <p className="notfound-message">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="notfound-home-link">
                    ⬅ Go back home
                </Link>
            </div>
        </Fragment>
    );
};

export default NotFound;
