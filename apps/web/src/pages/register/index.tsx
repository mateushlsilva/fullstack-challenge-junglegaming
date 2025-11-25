import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks";
import { registerSchemas, type RegisterDto } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";


function Register(){
    const registerUser = useRegister();
      const navigate = useNavigate();
      const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>({
        resolver: zodResolver(registerSchemas)
      });
    
      const onSubmit = (data: RegisterDto) => {
        registerUser.mutate(data);
      };
    return (
    <div className='flex items-center justify-center min-h-screen'>
      <Card className='w-full max-w-xl shadow-lg'>
        <CardHeader>
          <CardTitle>Cadastre sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail, nome e senha abaixo para cadastrar sua conta
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate({ to: '/login' })}>Entrar</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id='cadastro-form' onSubmit={handleSubmit(onSubmit)}>
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
            <Field className="mt-4.5">
              <FieldLabel>Nome</FieldLabel>
              <FieldContent>
                <Input 
                  type='text' 
                  id='nome'
                  placeholder='Seu Nome' 
                  required
                  {...register("userName")}
                />
                <FieldError>{errors.userName?.message}</FieldError>
              </FieldContent>            
            </Field>
            <Field>
              <div className="flex items-center justify-between mb-1 mt-4.5">
                <FieldLabel>Senha</FieldLabel>
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
          <Button form='cadastro-form' type="submit" className="w-full text-center" disabled={registerUser.isPending}>
            Cadastrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register