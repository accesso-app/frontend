const errorsMap = {
  500: 'Something went wrong on the server',
  1000: 'Email is not valid',
  1001: 'Another test error',
};

type ErrorKey = keyof typeof errorsMap;

export function getErorr(code: ErrorKey) {
  return errorsMap[code];
}
