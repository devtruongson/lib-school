import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book_Cate } from './Book_Categorie';

@Entity({
    name: 'categories',
})
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column('longtext')
    description: string;

    @Column('longtext')
    description_markdown: string;

    @Column({
        default: true,
    })
    is_active: boolean;

    @OneToMany(() => Book_Cate, (book) => book.book)
    book: Book_Cate[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
