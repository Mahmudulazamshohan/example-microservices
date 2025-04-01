import * as React from 'react';
import { Container, Grid } from '@mui/material';
import FeedCard from '../features/Card';
import { Outlet } from 'react-router-dom';

const Main: React.FC = () => {
  return (
    <Container>
      <Grid container spacing={1}>
        {Array.from(Array(1)).map((_, i) => (
          <Grid item xs={12} md={12} lg={12} key={i}>
            <FeedCard />
          </Grid>
        ))}
      </Grid>
      <Outlet />
    </Container>
  );
};

export default Main;
