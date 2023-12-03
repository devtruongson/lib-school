import { Body, Controller, Get, Post } from '@nestjs/common';
import { PointService } from './point.service';
import { createLocation } from './dto/createLocation.dto';
import { Location } from 'src/typeorm/entities/Location';
import { createApplicationIndustry } from './dto/createApplicationIndustry.dto';
import { createHitPoint } from './dto/createHitPoint.dto';

@Controller('point')
export class PointController {
    constructor(private readonly pointService: PointService) {}

    @Get('/point-location')
    getAllPoints(): Promise<Location[]> {
        return this.pointService.getAllPoints();
    }

    @Post('/create-location')
    createLocation(@Body() data: createLocation) {
        return this.pointService.createLocation(data);
    }

    @Post('/create-application-industry')
    createApplicationIndustry(@Body() data: createApplicationIndustry) {
        return this.pointService.createApplicationIndustry(data);
    }

    @Post('/create-hit-point')
    createHitPoint(@Body() data: createHitPoint) {
        return this.pointService.createApplicationHitPoint(data);
    }
}
