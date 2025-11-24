import '../../App.css'
import { useLogin } from '../../hooks'
import { loginSchemas, type LoginDto } from '../../schemas';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Login() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
    resolver: zodResolver(loginSchemas)
  });

  const onSubmit = (data: LoginDto) => {
    login.mutate(data);
  };


  return (
    <>
    <h1 style={{ color: 'black' }}>OIIIIIIIIIIIIIIIIIIIIIIIIi</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="E-mail" {...register("userEmail")} />
      {errors.userEmail && <p>{errors.userEmail.message}</p>}

      <input type="password" placeholder="Senha" {...register("userPassword")} />
      {errors.userPassword && <p>{errors.userPassword.message}</p>}

      <button type="submit" disabled={login.isPending}>
        Entrar
      </button>

      {login.isError && <p>Erro ao fazer login</p>}
    </form>
    </>
  )
}

export default Login
