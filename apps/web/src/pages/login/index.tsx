import { useLogin } from '../../hooks'
import { loginSchemas, type LoginDto } from '../../schemas';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from '@tanstack/react-router';


function Login() {
  const login = useLogin();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
    resolver: zodResolver(loginSchemas)
  });

  const onSubmit = (data: LoginDto) => {
    login.mutate(data);
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Card className='w-full max-w-xl shadow-lg'>
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para acessar sua conta
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate({ to: '/register' })}>Criar conta</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id='login-form' onSubmit={handleSubmit(onSubmit)}>
            <Field>
              <FieldLabel>E-mail</FieldLabel>
              <FieldContent>
                <Input 
                  type='email' 
                  id='email'
                  placeholder='seu.email@exemplo.com' 
                  required
                  {...register("userEmail")}
                />
                <FieldError>{errors.userEmail?.message}</FieldError>
              </FieldContent>            
            </Field>
            <Field>
              <div className="flex items-center justify-between mb-1 mt-4.5">
                <FieldLabel>Senha</FieldLabel>
                {/* <Button variant="link" className="text-sm underline-offset-4 hover:underline">
                  Esqueceu sua senha?
                </Button> */}
              </div>
              <FieldContent>
                <Input
                  type='password'
                  id='password'
                  placeholder='••••••••'
                  required
                  {...register("userPassword")}
                />
              </FieldContent>
              <FieldError>{errors.userPassword?.message}</FieldError>
            </Field>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button form='login-form' type="submit" className="w-full" disabled={login.isPending}>
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login