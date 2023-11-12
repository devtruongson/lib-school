import { Exclude } from 'class-transformer';

export class userSessionSerializerDTO {
    @Exclude()
    password: string;

    @Exclude()
    created_At: Date;

    @Exclude()
    updated_At: Date;

    constructor(partial: Partial<userSessionSerializerDTO>) {
        Object.assign(this, partial);
    }
}
