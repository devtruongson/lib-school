import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}