import { ERRORS_NAMES } from './domain/errorshandles'

export const constructorError = (message: string, name: string): Error => {
  const error = new Error(message)
  error.name = name
  return error
}

export const isKnownError = (name: string): Boolean => Boolean(ERRORS_NAMES[name as keyof typeof ERRORS_NAMES])
