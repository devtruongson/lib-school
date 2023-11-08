import { Book } from './entities/Book';
import { Order } from './entities/Order';
import { Profile } from './entities/Profile';
import { User } from './entities/User';
declare const entities: (typeof Book | typeof Profile | typeof User | typeof Order)[];
export default entities;