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
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { login } from '@/features/auth/model/authActions'
import { useState } from 'react'
import { Icons } from '@/components/icons'

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function Page() {
  const [loading, setLoading] = useState(false)
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

  const openGoogleLogin = () => {
    setLoading(true)

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`,
      '_blank',
      'width=500,height=600',
    )

    const listener = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_BASE_URL) return

      const { access_token, refresh_token, error } = event.data

      if (error) {
        console.error('Erro no login:', error)
        toast.error('Falha ao entrar com o Google. Tente novamente.')
        popup?.close()
        window.removeEventListener('message', listener)
        setLoading(false)
        return
      }

      if (access_token) {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-cookie`, {
          method: 'GET',
          credentials: 'include',
        })
          .then(() => {
            window.location.href = '/'
          })
          .catch(() => {
            toast.error('Erro ao verificar cookie.')
            setLoading(false)
          })
      } else {
        setLoading(false)
      }

      popup?.close()
      window.removeEventListener('message', listener)
    }

    window.addEventListener('message', listener)
  }

  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={openGoogleLogin}
              className="w-full"
            >
              {loading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-[350px]">
        <CardContent className="p-6 text-center text-sm ">
          Novo por aqui?{' '}
          <Link
            href="/register"
            className="text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Criar Conta
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
