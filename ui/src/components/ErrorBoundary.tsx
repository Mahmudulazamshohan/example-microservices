import * as React from 'react';
import { Alert } from '@mui/material';


interface ErrorBoundaryProps {
    children: JSX.Element;
    serviceName?: string;
};

interface ErrorBoundaryState {
    hasError: boolean;
    message?: string;

};

export default class ErrorBoundary
    extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    constructor(props: any) {
        super(props);
        this.state = { hasError: false, message: '' };
    }

    static getDerivedStateFromError(error: any) {
        return {
            hasError: true,
            message: error,
        };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="filled" severity="error">
                    {this.props?.serviceName ? `Something went wrong with ${this.props?.serviceName}` : 'Something went wrong.'}
                </Alert>
            );
        }

        return this.props.children;
    }
};