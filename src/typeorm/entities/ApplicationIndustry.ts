import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HitPoint } from './HitPoint';
import { Location } from './Location';

@Entity({
    name: 'ApplicationIndustry',
})
export class ApplicationIndustry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    code: string;

    @Column({
        nullable: false,
        unique: true,
    })
    slug: string;

    @OneToMany(() => HitPoint, (hitpoint) => hitpoint.ApplicationIndustry)
    hitpoint: HitPoint[];

    @ManyToOne(() => Location, (app) => app.ApplicationIndustry)
    location: Location;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}

// ApplicationIndustry: nghành ứng tuyển
