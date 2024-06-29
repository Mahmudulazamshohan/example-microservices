import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Grid } from '@mui/material';
import FeedCard from './features/Card';

const App: React.FC = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        {Array.from(Array(10)).map((n) => (
          <Grid item xs={12} md={4} lg={6} key={n}>
            <FeedCard key={n} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById('mainSection'));
