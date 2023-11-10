import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { editFileName, imageFileFilter } from 'src/utils/upload-image';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createDTO } from './dto/create.dto';
import { updateDTO } from './dto/update.dto';
import { IRes } from 'src/utils/interface';
import { updateStatusDTO } from './dto/updateStatus.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Book } from 'src/typeorm/entities/Book';
import { ConfigEnum } from 'src/utils/enum';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    findAllBooksByAdmin(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<Book>> {
        return this.bookService.findAllBooksByAdmin({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_CATE_GET_ALL,
        });
    }

    @Post('')
    @UseInterceptors(
        FilesInterceptor('images[]', 20, {
            storage: diskStorage({
                destination: './files/images/app/book',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async createBook(@Body() createData: createDTO, @UploadedFiles() files: Express.Multer.File[]): Promise<any> {
        if (!files.length) {
            throw new HttpException('Bạn phải tải ít nhất 1 ảnh!', HttpStatus.BAD_REQUEST);
        }
        return this.bookService.createBook(createData, files);
    }

    @Put()
    @UseInterceptors(
        FilesInterceptor('images[]', 20, {
            storage: diskStorage({
                destination: './files/images/app/book',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    updateBook(@Body() data: updateDTO, @UploadedFiles() files: Express.Multer.File[]): Promise<IRes> {
        if (data.is_change_thumbnail && !files.length) {
            throw new HttpException('Bạn phải tải ít nhất 1 ảnh!', HttpStatus.BAD_REQUEST);
        }
        return this.bookService.updateBook(data, files);
    }

    @Patch()
    updateStatus(@Body() data: updateStatusDTO): Promise<IRes> {
        return this.bookService.updateStatus(data);
    }

    @Delete()
    deleteBook(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.deleteBook(id);
    }
}
