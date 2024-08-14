
import * as React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";

import AuthWrapper from './AuthWrapper';
import Header from './components/Header';
import { Box, Card, Grid } from '@mui/material';
import MainPage from './pages/MainPage';


const CounterAppOne = React.lazy(() => import("feed/CounterAppOne"));
const SharePost = React.lazy(() => import("feed/features/SharePost"));
const FeedSection = React.lazy(() => import("feed/sections/FeedSection"));
const LoginPage = React.lazy(() => import("authentication/LoginPage"));

const routers = createBrowserRouter([
    {
        path: '/',
        element: <AuthWrapper />,
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
    },
    {
        path: '*',
        element: <p>Not found</p>
    }
]);

export default routers;
