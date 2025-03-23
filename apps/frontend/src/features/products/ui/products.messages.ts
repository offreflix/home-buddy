import { CreateResult, Status } from './products.type'

export const CREATE_PRODUCTS_MESSAGES: Record<Status, CreateResult> = {
  422: { status: 'error', message: 'Já existe um produto com o mesmo nome.' },
  success: { status: 'success', message: 'Produto adicionado com sucesso!' },
  error: {
    status: 'error',
    message: 'Falha ao adicionar produto, tente novamente mais tarde.',
  },
}
