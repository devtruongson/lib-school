import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'profiles',
})
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    avatar_url: string;

    @Column()
    phoneNumber: string;

    @Column()
    address: string;

    @Column()
    school: string;

    @Column()
    class: string;

    @Column()
    birthday: Date;

    @Column('longtext')
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
