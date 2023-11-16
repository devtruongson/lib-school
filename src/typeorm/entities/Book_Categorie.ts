import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categories } from './Cate';
import { Book } from './Book';

@Entity({
    name: 'books_categories',
})
export class Book_Cate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book, (book) => book.categories)
    book: Book;

    @ManyToOne(() => Categories, (cate) => cate.book)
    cate: Categories;
}
