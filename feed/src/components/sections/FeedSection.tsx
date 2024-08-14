import * as React from 'react';
import SharePost from '../features/SharePost';
import PostList from '../features/PostList';

const FeedSection: React.FC = () => {
  return (
    <>
      <SharePost />
      <PostList />
    </>
  );
};

export default FeedSection;
