import * as React from 'react';
import { FC, lazy } from 'react';
import { Grid, Box, Card, Container, Typography } from '@mui/material';
import WithNavbar from '../features/WithNavbar';

const FeedSection = lazy(() => import("feed/sections/FeedSection"));

const MainPage: FC = () => {
    return (
        <WithNavbar>
            <Container disableGutters>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                        <Box
                            marginTop={3}
                            marginBottom={3}>
                            <Card elevation={0}>
                                <Box padding={3} height={400}>
                                    <Typography>Abcd</Typography>
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <FeedSection />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Box
                            marginTop={3}
                            marginBottom={3}>
                              <Card elevation={0}>
                                <Box padding={3} height={400}>
                                    <Typography>Abcd</Typography>
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </WithNavbar>
    )
};

export default MainPage;