import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationIndustry } from 'src/typeorm/entities/ApplicationIndustry';
import { HitPoint } from 'src/typeorm/entities/HitPoint';
import { Location } from 'src/typeorm/entities/Location';

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationIndustry, HitPoint, Location])],
    controllers: [PointController],
    providers: [PointService],
})
export class PointModule {}
