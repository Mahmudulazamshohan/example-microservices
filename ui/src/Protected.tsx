import * as React from 'react';
import { lazy, Suspense, FC } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const AuthGuard = lazy(() => import("authentication/AuthGuard"));
const Protected: FC = () => {
    return (
        <ErrorBoundary>
            <Suspense>
                <AuthGuard />
            </Suspense>
        </ErrorBoundary>
    );
};

export default Protected;