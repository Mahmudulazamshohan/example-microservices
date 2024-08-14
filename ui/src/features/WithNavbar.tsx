
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';

interface WithNavbarProps extends PropsWithChildren {

};

const WithNavbar: React.FC<WithNavbarProps> = ({ children }) => {
    return (
        <Box>
            <Header />
            {children}
        </Box>
    );
};

export default WithNavbar;