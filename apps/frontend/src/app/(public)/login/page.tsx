'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { login } from './action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function Page() {
  const router = useRouter()
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('password', values.password)

    const result = await login(formData)

    if (result.error) {
      console.log('Login error:', result)
      switch (result.status) {
        case 401:
          toast.error('Usuário ou senha inválidos, tente novamente.')
          break
        case 500:
          toast.error('Erro no servidor.')
          break
        default:
          toast.error(result.error)
      }
    } else {
      toast.success('Login successful!')
      router.push('/')
    }
  }

  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      Senha
                      <Link className="text-blue-300" href="/reset-password">
                        Esqueceu a senha?
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-[350px]">
        <CardContent className="p-6 text-center">
          Novo por aqui?{' '}
          <Link className="text-blue-300" href="/register">
            Criar Conta
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
