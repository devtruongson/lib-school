import { ROLE_APP_MANAGE } from 'src/utils/enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';
import { Profile } from './Profile';

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    fistName: string;

    @Column({
        nullable: false,
    })
    lastName: string;

    @Column({
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        nullable: false,
    })
    password: string;

    @Column({
        default: false,
    })
    is_verify_email: boolean;

    @Column({
        default: ROLE_APP_MANAGE.user,
    })
    role: ROLE_APP_MANAGE.user | ROLE_APP_MANAGE.admin;

    @Column({
        nullable: false,
    })
    slug: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;

    @Column({
        default: false,
    })
    is_login_fire_base: boolean;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_At: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_At: Date;
}
