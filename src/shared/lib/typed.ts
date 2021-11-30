import * as typed from 'typed-contracts';

export function assertContract<T>(contract: typed.Contract<T>, data: unknown, name = 'body'): T {
  const validated = contract(name)(data);
  if (validated instanceof typed.ValidationError) {
    throw validated;
  }
  return validated;
}

export type ContractType<C extends typed.Contract<unknown>> = C extends typed.Contract<infer T>
  ? T
  : never;
