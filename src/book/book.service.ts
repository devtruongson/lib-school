import { Injectable } from '@nestjs/common';
import { createDTO } from './dto/create.dto';

@Injectable()
export class BookService {
    createBook(data: createDTO, files: Express.Multer.File[]) {
        const [thumbnail_url, ...images] = files;
        console.log(thumbnail_url);
        console.log(images);
        return new Promise((resolve) => {
            resolve(1);
        });
    }
}
