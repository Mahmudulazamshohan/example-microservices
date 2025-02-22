import { Comment } from './Comments';
import { Connection } from './Connections';
import { Like } from './Like';
import { Post } from './Post';

export const ENTITIES = [Post, Like, Connection, Comment];

export default {
  Post,
  Like,
  Connection,
  Comment,
};
