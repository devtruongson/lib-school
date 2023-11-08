import { AuthService } from './auth.service';
import { registerDTO } from './DTO/register.dto';
import { Response, Request } from 'express';
import { signInFireBaseDTO } from './DTO/signInFireBase.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(userDTO: registerDTO, req: Request, res: Response): Promise<void | import("../typeorm/entities/User").User>;
    signInWithFireBase(signInFireBase: signInFireBaseDTO, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
