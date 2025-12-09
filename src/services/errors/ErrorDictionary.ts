export type ErrorCode =
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'VALIDATION_ERROR'
    | 'UNKNOWN_ERROR'

export const ErrorDictionary: Record<ErrorCode, string> = {
    NETWORK_ERROR: 'Não foi possível conectar ao servidor.',
    TIMEOUT: 'O servidor demorou para responder.',
    UNAUTHORIZED: 'Credenciais inválidas.',
    FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
    NOT_FOUND: 'Recurso não encontrado.',
    SERVER_ERROR: 'Erro interno do servidor.',
    VALIDATION_ERROR: 'Dados inválidos enviados ao servidor.',
    UNKNOWN_ERROR: 'Ocorreu um erro inesperado.',
}
