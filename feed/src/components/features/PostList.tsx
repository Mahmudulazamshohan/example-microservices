import * as React from 'react';
import { Grid } from '@mui/material';
import FeedCard from '../features/Card';

const PostList: React.FC = () => {
  return (
    <Grid container rowGap={2}>
      {Array.from(Array(10)).map((_, i) => (
        <Grid item xs={12} md={12} lg={12} key={i}>
          <FeedCard key={i} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
