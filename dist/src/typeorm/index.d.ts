import { Book } from './entities/Book';
import { Order } from './entities/Order';
import { Profile } from './entities/Profile';
import { User } from './entities/User';
declare const entities: (typeof Profile | typeof User | typeof Order | typeof Book)[];
export default entities;
