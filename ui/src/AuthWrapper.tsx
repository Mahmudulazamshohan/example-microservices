import * as React from 'react';
import { Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const AuthGuard = React.lazy(() => import("authentication/AuthGuard"));
const AuthWrapper: React.FC = () => {
    return (
        <ErrorBoundary>
            <Suspense>
                <AuthGuard />
            </Suspense>
        </ErrorBoundary>
    )
};
export default AuthWrapper;