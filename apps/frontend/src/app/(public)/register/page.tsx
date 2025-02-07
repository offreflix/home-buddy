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
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { register } from './action'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

const registerSchema = z
  .object({
    username: z.string().min(1, 'Usuário é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  })

function PasswordStrengthIndicator({ strength }: { strength: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300',
          strength < 25
            ? 'bg-red-500'
            : strength < 50
              ? 'bg-orange-500'
              : strength < 75
                ? 'bg-yellow-500'
                : 'bg-green-500',
        )}
        style={{ width: `${strength}%` }}
      />
    </div>
  )
}

type RegisterSchema = z.infer<typeof registerSchema>

export default function Page() {
  const router = useRouter()
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: RegisterSchema) {
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('email', values.email)
    formData.append('password', values.password)

    const result = await register(formData)

    if (result.error) {
      console.log('Register error:', result)
      switch (result.status) {
        case 409:
          toast.error('Usuário ou email já existem.')
          break
        case 500:
          toast.error('Erro no servidor.')
          break
        default:
          toast.error(result.error)
      }
    } else {
      toast.success('Registro realizado com sucesso!')
      router.push('/login')
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.match(/[a-z]+/)) strength += 20
    if (password.match(/[A-Z]+/)) strength += 20
    if (password.match(/[0-9]+/)) strength += 20
    if (password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)) strength += 20
    setPasswordStrength(strength)
  }

  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>Registre-se para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                      <PasswordInput
                        showPassword={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                        field={field}
                        calculatePasswordStrength={calculatePasswordStrength}
                      />
                    </FormControl>
                    <PasswordStrengthIndicator strength={passwordStrength} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        showPassword={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Registrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-[350px]">
        <CardContent className="p-6 text-center">
          Já tem uma conta?{' '}
          <Link className="text-blue-300" href="/login">
            Fazer Login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

interface PasswordInputProps {
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
  field: ControllerRenderProps<RegisterSchema, 'password' | 'confirmPassword'>
  calculatePasswordStrength?: (password: string) => void
}

const PasswordInput = ({
  showPassword,
  setShowPassword,
  field,
  calculatePasswordStrength,
}: PasswordInputProps) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        {...field}
        onChange={(e) => {
          field.onChange(e)
          calculatePasswordStrength?.(e.target.value)
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}
