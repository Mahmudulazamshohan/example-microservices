import * as React from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';

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
            message: error?.message || '',
        };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '80vh',
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Oops!
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Something went wrong. Please try again later.
                        </Typography>
                        <Box mt={4}>
                            <Button variant="outlined" color="primary" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </Box>
                        {this.state?.hasError && (
                            <Alert style={{ marginTop: 10 }} variant="filled" severity="error">{this.state.message}</Alert>
                        )}
                      
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
};