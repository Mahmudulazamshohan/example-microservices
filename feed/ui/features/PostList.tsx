import * as React from 'react';
import { Grid } from '@mui/material';
import Card from './Card';

const PostList: React.FC = () => {
  return (
    <Grid container rowGap={2}>
      {Array.from(Array(1)).map((_, i: number) => (
        <Grid item xs={12} md={12} lg={12} key={i}>
          <Card />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
