import * as React from 'react';
import {
    Grid,
    Box,
    Card,
    Container,
    Typography,
    Avatar,
    colors,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Bookmark as BookmarkIcon,
    Groups as GroupsIcon,
    Event as EventIcon
} from '@mui/icons-material';

import WithNavbar from '../features/WithNavbar';

const FeedSection = React.lazy(() => import("feed/sections/FeedSection"));

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
                                    <Box
                                        display={'flex'}
                                        justifyContent={'center'}>
                                        <Avatar
                                            src='https://media.licdn.com/dms/image/D5603AQEm02djvZLyQw/profile-displayphoto-shrink_100_100/0/1707895378353?e=1729123200&v=beta&t=Nka-YlabpB2XchYXp3dGIp63JvrglkO1u8SaAiiUGUY'
                                            alt='Mahmudul Azam'
                                            sx={{ width: 56, height: 56 }}
                                        />
                                    </Box>
                                    <Typography
                                        align="center"
                                        fontWeight="bold">Mahmudul Azam</Typography>
                                    <Typography
                                        sx={{ wordBreak: 'break-word' }}
                                        color={colors.grey['700']}
                                        fontSize={12}>Software engineer @ Field Nation | Nodejs | AWS | Kubernetes | Full Stack.</Typography>
                                </Box>
                            </Card>
                        </Box>

                        <Box marginTop={2}>
                            <Card elevation={0}>
                                <Box padding={1}>
                                    <Typography
                                        align="left"
                                        fontWeight="bold"
                                        fontSize={12}
                                        padding={1}>
                                        People you may know
                                    </Typography>
                                    <Divider />
                                    {[1, 2].map((_) => (
                                        <Box margin={1} gap={1}>
                                            <Box display={"flex"}>
                                                <Box>
                                                    <Avatar
                                                        src='https://media.licdn.com/dms/image/D5603AQEm02djvZLyQw/profile-displayphoto-shrink_100_100/0/1707895378353?e=1729123200&v=beta&t=Nka-YlabpB2XchYXp3dGIp63JvrglkO1u8SaAiiUGUY'
                                                        alt='Mahmudul Azam' sx={{ width: 56, height: 56, marginRight: 1 }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography fontSize={14} fontWeight={600}>Mahmudul Azam</Typography>
                                                    <Typography
                                                        fontSize={10}
                                                        color={colors.grey}
                                                    >
                                                        Founder & CEO @ People Group | Tech & D2C Builder & Investor 🦈 @Shark Tank India
                                                    </Typography>
                                                    <Box marginTop={1} marginBottom={1}>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<AddIcon />}
                                                        >
                                                            Follow
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <FeedSection />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Card elevation={0} sx={{ marginTop: 3 }}>
                            <CardContent>
                                <List>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <BookmarkIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Saved items" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <GroupsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Groups" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <EventIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Events" />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </WithNavbar>
    );
};

export default MainPage;