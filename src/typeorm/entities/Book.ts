import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'books',
})
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    title: string;

    @Column('longtext')
    description: string;

    @Column()
    thumbnail_url: string;

    @Column({ nullable: false })
    slug: string;

    @Column({
        nullable: false,
    })
    stock: number;

    @Column({
        default: true,
    })
    is_active: boolean;

    @Column()
    count_borrow_books: number;

    @Column({
        default: 0,
    })
    view_book: number;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
