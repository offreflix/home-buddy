'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Copy, Check, RefreshCw, AlertCircle, Trash2, Plus } from 'lucide-react'

interface PatResponse {
  token: string
  pat: {
    id: string
    name: string
    permissions: string[]
    createdAt: string
    expiresAt?: string
  }
}

interface Pat {
  id: string
  name: string
  permissions: string[]
  createdAt: string
  expiresAt?: string
  lastUsedAt?: string
}

const AVAILABLE_PERMISSIONS = [
  { id: 'read:products', label: 'Ler produtos' },
  { id: 'read:categories', label: 'Ler categorias' },
  { id: 'read:stock', label: 'Ler estoque' },
  { id: 'write:stock', label: 'Escrever estoque' },
  { id: 'read:tracking', label: 'Ler tracking' },
  { id: 'write:scraping', label: 'Executar scraping' },
]

export default function McpPage() {
  const [token, setToken] = useState<string | null>(null)
  const [pats, setPats] = useState<Pat[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patName, setPatName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'read:products',
    'read:categories',
  ])

  const fetchPats = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/pat', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setPats(data)
      }
    } catch (err) {
      console.error('Erro ao buscar PATs:', err)
    }
  }

  const generatePat = async () => {
    if (!patName.trim()) {
      setError('Nome do token é obrigatório')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const requestData = {
        name: patName,
        permissions: selectedPermissions,
        expiresInDays: 30, // 30 dias
      }

      console.log('Enviando dados para criar PAT:', requestData)

      const response = await fetch('http://localhost:3000/auth/pat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const data: PatResponse = await response.json()
        setToken(data.token)
        setPatName('')
        fetchPats() // Atualizar lista
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erro ao gerar PAT')
      }
    } catch (err) {
      setError('Erro de conexão ao gerar PAT')
    } finally {
      setLoading(false)
    }
  }

  const revokePat = async (patId: string) => {
    if (!confirm('Tem certeza que deseja revogar este token?')) return

    try {
      const response = await fetch(`http://localhost:3000/auth/pat/${patId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        fetchPats() // Atualizar lista
      } else {
        setError('Erro ao revogar token')
      }
    } catch (err) {
      setError('Erro de conexão ao revogar token')
    }
  }

  const copyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    )
  }

  useEffect(() => {
    fetchPats()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personal Access Tokens</h1>
          <p className="text-muted-foreground">
            Gerencie tokens de acesso para integração com MCP e APIs
          </p>
        </div>
        <Button onClick={fetchPats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gerar novo PAT */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Token</CardTitle>
          <CardDescription>
            Crie um novo Personal Access Token para usar com MCP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pat-name">Nome do Token</Label>
            <Input
              id="pat-name"
              value={patName}
              onChange={(e) => setPatName(e.target.value)}
              placeholder="Ex: MCP Development Token"
            />
          </div>

          <div>
            <Label>Permissões</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                  <Label htmlFor={permission.id} className="text-sm">
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={generatePat} disabled={loading || !patName.trim()}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Gerar Token
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Token gerado */}
      {token && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">
              Token Gerado com Sucesso!
            </CardTitle>
            <CardDescription className="text-green-600">
              Copie este token e configure no Cursor. Ele só será exibido uma
              vez.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input value={token} readOnly className="font-mono text-sm" />
              <Button onClick={copyToken} size="sm">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de PATs existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Tokens Existentes</CardTitle>
          <CardDescription>
            Gerencie seus Personal Access Tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pats || pats.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum token criado ainda
            </p>
          ) : (
            <div className="space-y-4">
              {pats.map((pat) => (
                <div
                  key={pat.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{pat.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Criado em{' '}
                      {new Date(pat.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pat.permissions?.map((permission) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => revokePat(pat.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revogar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções de configuração */}
      <Card>
        <CardHeader>
          <CardTitle>Como Configurar no Cursor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Copie o token gerado acima</h4>
            <p className="text-sm text-muted-foreground">
              O token será exibido apenas uma vez após a criação
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">
              2. Atualize o arquivo de configuração do Cursor
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Edite o arquivo:{' '}
              <code className="bg-muted px-1 rounded">
                c:\Users\offre\.cursor\mcp.json
              </code>
            </p>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              {`{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": ["C:\\dev\\home-buddy-monorepo\\apps\\mcp-server\\dist\\index.js"],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "PAT_TOKEN": "SEU_TOKEN_AQUI",
        "INTERNAL_TOKEN": "algum_token_seguro"
      }
    }
  }
}`}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Reinicie o Cursor</h4>
            <p className="text-sm text-muted-foreground">
              Feche e abra o Cursor para aplicar as configurações
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
