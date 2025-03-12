const ERROR_CODE_PERMISSION = {
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  NO_PERMISSION_TO_DELETE_RULE: 'No permission to delete rule',
  NO_PERMISSION_TO_UPDATE_RULE: 'No permission to update rule',
}

export const ERROR_CODE = {
  ...ERROR_CODE_PERMISSION,
}

type ErrorCode = keyof typeof ERROR_CODE

export const getCodeMessage = (code: ErrorCode) => {
  return ERROR_CODE[code]
}
