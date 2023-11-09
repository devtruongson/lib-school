import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Book } from './Book';

@Entity({
    name: 'orders',
})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        default: false,
    })
    is_give_book_back: boolean;

    @Column({
        nullable: false,
    })
    time_order: Date;

    @Column({
        nullable: false,
    })
    expire_give_book: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @ManyToMany(() => Book)
    @JoinTable()
    books: Book[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
