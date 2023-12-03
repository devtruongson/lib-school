import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationIndustry } from './ApplicationIndustry';

@Entity({
    name: 'hitpoints',
})
export class HitPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @Column()
    point_high_school_exam: string; // điẻm thi thpt quốc gia

    @Column()
    point_school_profile: string;

    @Column()
    point_dgnl: string; // dgnl : đánh giá  năng lực

    @Column()
    point_dgtd: string; // dgtd : đánh giá tư duy

    @ManyToOne(() => ApplicationIndustry, (app) => app.hitpoint)
    ApplicationIndustry: ApplicationIndustry;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
