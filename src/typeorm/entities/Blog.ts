import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'blogs',
})
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    title: string;

    @Column({
        default: true,
    })
    is_active: boolean;

    @Column({
        nullable: false,
        unique: true,
    })
    slug: string;

    @Column('longtext')
    meta_description: string;

    @Column('longtext')
    contentHTML: string;

    @Column('longtext')
    contentMarkDown: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
