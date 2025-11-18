import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class refreshTokenDto{
    @ApiProperty({
        description: 'Refresh token JWT usado para gerar um novo access token.',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsString()
    @IsNotEmpty({ message: 'O refresh token não pode estar vazio.' })
    refresh_token: string;
}