import { AuthService } from './auth.service';
import { registerDTO } from './DTO/register.dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(userDTO: registerDTO, req: Request, res: Response): Promise<void | import("../typeorm/entities/User").User>;
    get(): string;
}
