import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'profiles',
})
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    avatar_url: string;

    @Column({
        default: null,
    })
    phoneNumber: string;

    @Column({
        default: null,
    })
    address: string;

    @Column({
        default: null,
    })
    school: string;

    @Column({
        default: null,
    })
    class: string;

    @Column({
        default: null,
    })
    birthday: Date;

    @Column('longtext', {
        default: null,
    })
    description: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
