import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Images } from './Image';
import { Categories } from './Cate';

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

    @OneToMany(() => Images, (image) => image.book)
    images: Images;

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

    @Column({
        default: 0,
    })
    count_borrow_books: number;

    @Column({
        default: 0,
    })
    view_book: number;

    @ManyToMany(() => Categories)
    @JoinTable()
    books: Categories[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
