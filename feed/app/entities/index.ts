import { Comment } from './Comment';
import { Connection } from './Connection';
import { Like } from './Like';
import { Post } from './Post';
import { PostMedia } from './PostMedia';

export const ENTITIES = [Post, Like, Connection, Comment];

export default {
  Post,
  Like,
  Connection,
  Comment,
  PostMedia,
};
