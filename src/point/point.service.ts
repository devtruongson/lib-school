import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createLocation } from './dto/createLocation.dto';
import { v4 as uuid4 } from 'uuid';
import slugify from 'slugify';
import { Location } from 'src/typeorm/entities/Location';
import { createApplicationIndustry } from './dto/createApplicationIndustry.dto';
import { ApplicationIndustry } from 'src/typeorm/entities/ApplicationIndustry';
import { createHitPoint } from './dto/createHitPoint.dto';
import { HitPoint } from 'src/typeorm/entities/HitPoint';

@Injectable()
export class PointService {
    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
        @InjectRepository(HitPoint) private readonly hitPointRepository: Repository<HitPoint>,
        @InjectRepository(ApplicationIndustry)
        private readonly applicationIndustryRepository: Repository<ApplicationIndustry>,
    ) {}

    getAllPoints(): Promise<Location[]> {
        return this.locationRepository.find({
            where: {},
            relations: ['ApplicationIndustry', 'ApplicationIndustry.hitpoint'],
        });
    }

    createLocation(data: createLocation) {
        const locationCreate = this.locationRepository.create({
            title: data.title,
            code: parseInt(data.code),
            slug: slugify(`${data.title} ${uuid4()}`),
        });
        return this.locationRepository.save(locationCreate);
    }

    async createApplicationIndustry(data: createApplicationIndustry) {
        const locationCheck = await this.locationRepository.findOne({
            where: {
                id: parseInt(data.location),
            },
        });

        if (!locationCheck) {
            throw new BadRequestException();
        }

        const appCreate = this.applicationIndustryRepository.create({
            title: data.title,
            code: data.code,
            location: locationCheck,
            slug: slugify(`${data.title} ${uuid4()}`),
        });

        return this.applicationIndustryRepository.save(appCreate);
    }

    async createApplicationHitPoint(data: createHitPoint) {
        const appCheck = await this.applicationIndustryRepository.findOne({
            where: {
                code: data.app,
            },
        });

        if (!appCheck) {
            throw new BadRequestException();
        }

        const hitPointCreate = this.hitPointRepository.create({
            year: data.yearn,
            point_dgnl: data.point_dgnl,
            point_high_school_exam: data.point_high_school_exam,
            point_school_profile: data.point_school_profile,
            point_dgtd: data.point_dgtd,
            ApplicationIndustry: appCheck,
        });

        return this.hitPointRepository.save(hitPointCreate);
    }
}
