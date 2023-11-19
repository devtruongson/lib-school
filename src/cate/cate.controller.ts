import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CateService } from './cate.service';
import { createCateDTO } from './dto/createCate.dto';
import { IRes } from 'src/utils/interface';
import { updateCateDTO } from './dto/updateCate.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Categories } from 'src/typeorm/entities/Cate';
import { ConfigEnum } from 'src/utils/enum';

@Controller('cate')
export class CateController {
    constructor(private readonly cateService: CateService) {}

    @Post()
    createCate(@Body() data: createCateDTO): Promise<IRes> {
        return this.cateService.createCate(data);
    }

    @Put('/update')
    updateCate(@Body() data: updateCateDTO): Promise<IRes> {
        return this.cateService.updateCate(data);
    }

    @Get()
    getAllCates(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<Categories>> {
        return this.cateService.getAllCates({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_CATE_GET_ALL,
        });
    }

    @Get('/filter-all')
    filterAll(): Promise<IRes> {
        return this.cateService.filterAll();
    }

    @Get('/filter-pagination')
    filterAllPagin(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<Categories>> {
        return this.cateService.filterAllPagin({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_CATE_GET_ALL_FILTER,
        });
    }
}
