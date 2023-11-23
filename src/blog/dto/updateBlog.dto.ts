import { IsNotEmpty } from 'class-validator';
import { createBlogDTO } from './createBlog.dto';

export class updateBlogDTO extends createBlogDTO {
    @IsNotEmpty()
    id: number;
}
