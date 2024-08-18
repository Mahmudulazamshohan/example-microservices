import * as React from 'react';
import { FC } from 'react';

import SharePost from '../features/SharePost';
import PostList from '../features/PostList';

const FeedSection: FC = () => {
  return (
    <>
      <SharePost />
      <PostList />
    </>
  );
};

export default FeedSection;
