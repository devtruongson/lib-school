/* eslint-disable @typescript-eslint/ban-types */
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return callback(new BadRequestException(), false);
    }

    callback(null, true);
};

export const imageFileFilterNotCheck = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file || !file.originalname) {
        callback(null, false);
        return;
    }
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return callback(new BadRequestException(), false);
    }

    callback(null, true);
};

export const editFileName = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file || !file.originalname) {
        return;
    }

    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

export const uploadImage = (destination: string) => ({
    storage: diskStorage({
        destination: destination,
        filename: editFileName,
    }),
    fileFilter: imageFileFilter,
});

export const uploadImageNotVerify = (destination: string) => ({
    storage: diskStorage({
        destination: destination,
        filename: editFileName,
    }),
    fileFilter: imageFileFilterNotCheck,
});

export const removeFile = (fullFilePath: string): void => {
    try {
        fs.unlinkSync(fullFilePath);
    } catch (err) {
        console.error(err);
    }
};
