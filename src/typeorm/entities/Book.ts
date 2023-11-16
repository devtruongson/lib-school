import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Images } from './Image';
import { Book_Cate } from './Book_Categorie';

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

    @Column()
    meta_description: string;

    @Column()
    meta_title: string;

    @Column('longtext')
    description: string;

    @Column('longtext')
    description_markdown: string;

    @Column()
    thumbnail_url: string;

    @OneToMany(() => Images, (image) => image.book)
    images: Images[];

    @Column({ nullable: false })
    slug: string;

    @Column({
        nullable: false,
    })
    stock: number;

    @Column({
        nullable: false,
    })
    stock_brows: number;

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

    @OneToMany(() => Book_Cate, (cate) => cate.book)
    categories: Book_Cate[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
