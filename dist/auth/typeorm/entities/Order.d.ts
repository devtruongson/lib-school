import { User } from './User';
import { Book } from './Book';
export declare class Order {
    id: number;
    is_give_book_back: boolean;
    time_order: Date;
    expire_give_book: Date;
    user: User;
    followers: Book[];
    created_At: Date;
    updated_At: Date;
}
