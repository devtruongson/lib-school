import { IsNotEmpty } from 'class-validator';

export class createHitPoint {
    @IsNotEmpty()
    yearn: number;

    @IsNotEmpty()
    app: string;

    @IsNotEmpty()
    point_high_school_exam: string;

    @IsNotEmpty()
    point_school_profile: string;

    @IsNotEmpty()
    point_dgnl: string;

    @IsNotEmpty()
    point_dgtd: string;
}
