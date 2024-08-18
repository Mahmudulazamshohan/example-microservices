import * as React from 'react';
import { FC, lazy } from 'react';
import { Grid, Box, Card, Container, Typography, Avatar, colors, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'

import WithNavbar from '../features/WithNavbar';

const FeedSection = lazy(() => import("feed/sections/FeedSection"));

const MainPage: React.FC = () => {
    return (
        <WithNavbar>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                        <Box
                            marginTop={3}>
                            <Card elevation={0}>
                                <Box padding={3}>
                                    <Box display={'flex'} justifyContent={'center'}>
                                        <Avatar src='https://media.licdn.com/dms/image/D5603AQEm02djvZLyQw/profile-displayphoto-shrink_100_100/0/1707895378353?e=1729123200&v=beta&t=Nka-YlabpB2XchYXp3dGIp63JvrglkO1u8SaAiiUGUY' alt='Mahmudul Azam' sx={{ width: 56, height: 56 }} />
                                    </Box>
                                    <Typography align="center" fontWeight="bold">Mahmudul Azam</Typography>
                                    <Typography sx={{ wordBreak: 'break-word' }} color={colors.grey['700']} fontSize={12}>Software engineer @ Field Nation | Nodejs | AWS | Kubernetes | Full Stack.</Typography>
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <FeedSection />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Box
                            marginTop={3}>
                            <Card elevation={0}>
                                <Box padding={3}>
                                    <Typography
                                        align="left"
                                        fontWeight="bold"
                                        fontSize={12}
                                        padding={1}>
                                        People you may know
                                    </Typography>
                                    <Divider />

                                    {[1, 2, 3, 4].map((_) => (
                                        <Box margin={1} gap={1}>
                                            <Typography fontSize={12}>Mahmudul Azam</Typography>
                                            <Box marginTop={1} marginBottom={1}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<AddIcon />}>
                                                    Follow
                                                </Button>
                                            </Box>
                                        </Box>
                                    ))}

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