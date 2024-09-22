import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const handleGoHome = () => navigate('/');

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main' }} />
            <Typography variant="h3" gutterBottom sx={{ marginTop: 2 }}>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 4 }}>
                Sorry, the page you're looking for doesn't exist or has been moved.
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoHome}
                    sx={{ marginTop: 2 }}
                >
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
