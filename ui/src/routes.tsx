
import * as React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";

import AuthWrapper from './AuthWrapper';
import MainPage from './pages/MainPage';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

const LoginPage = React.lazy(() => import("authentication/LoginPage"));
const SignupPage = React.lazy(() => import("authentication/SignupPage"));

const routers = createBrowserRouter([
    {
        path: '/',
        element: (
            <ErrorBoundary>
                <AuthWrapper />
            </ErrorBoundary>
        ),
        children: [
            {
                path: '',
                element: <MainPage />,
            }
        ],

    },
    {
        path: 'login',
        element: (
            <Suspense>
                <LoginPage />
            </Suspense>
        ),
    },{
        path: 'signup',
        element: (
            <Suspense>
                <ErrorBoundary>
                    <SignupPage />
                </ErrorBoundary>
            </Suspense>
        ),
    },
    {
        path: '*',
        element: <NotFoundPage />
    },
]);

export default routers;
