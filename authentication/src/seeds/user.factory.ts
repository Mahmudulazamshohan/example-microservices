import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/User';

export default setSeederFactory(User, async (faker) => {
  const user = new User();
  user.username = faker.internet.email(user.username);
  user.password = await bcrypt.hashSync('123456', 10);
  user.hashedRt = '';
  return user;
});
