import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationIndustry } from './ApplicationIndustry';

@Entity({
    name: 'locations',
})
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    title: string;

    @Column({
        nullable: false,
        unique: true,
    })
    slug: string;

    @Column()
    code: number;

    @OneToMany(() => ApplicationIndustry, (app) => app.location)
    ApplicationIndustry: ApplicationIndustry[];

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
