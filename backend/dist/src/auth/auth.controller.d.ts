import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            nome: string;
            email: string;
            perfil: string;
        };
        token: string;
    }>;
}
