import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './Book';

@Entity({
    name: 'images',
})
export class Images {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    link_url: string;

    @Column({
        default: true,
    })
    is_active: boolean;

    @Column()
    destination: string;

    @ManyToOne(() => Book, (book) => book.images)
    book: Book;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
