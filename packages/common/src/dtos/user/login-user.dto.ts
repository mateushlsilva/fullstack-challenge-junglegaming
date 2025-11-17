import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDTO {
    @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
    @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
    @IsString()
    userEmail: string;

    @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
    @IsString()
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
    @MaxLength(128)
    userPassword: string
}