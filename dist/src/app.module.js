"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const User_1 = require("./typeorm/entities/User");
const Order_1 = require("./typeorm/entities/Order");
const Book_1 = require("./typeorm/entities/Book");
const Profile_1 = require("./typeorm/entities/Profile");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.port),
                username: 'root',
                password: 'fstack@1234',
                database: 'lib_school',
                entities: [User_1.User, Order_1.Order, Book_1.Book, Profile_1.Profile],
                synchronize: true,
                autoLoadEntities: true,
            }),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map