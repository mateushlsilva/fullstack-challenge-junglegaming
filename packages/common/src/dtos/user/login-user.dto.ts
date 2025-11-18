import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginUserDTO {
    @ApiProperty({
        description: 'O endereço de email único do usuário (será usado para login).',
        example: 'joao.silva@exemplo.com',
    })
    @IsEmail({}, { message: 'O e-mail deve ser um endereço válido.' })
    @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
    @IsString()
    userEmail: string;


    @ApiProperty({
        description: 'A senha do usuário.',
        example: 'senhaSegura123',
        minLength: 8,
    })
    @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
    @IsString()
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
    @MaxLength(128)
    userPassword: string
}