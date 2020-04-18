declare module 'typed-contracts' {
  export class ValidationError {
    readonly valueName: string;
    readonly expectedTypes: ReadonlyArray<string>;
    readonly value: unknown;
    readonly nested: ReadonlyArray<ValidationError>;

    constructor(
      valueName: string,
      value: unknown,
      expectedTypes?: string | ReadonlyArray<string>,
      nested?: ReadonlyArray<ValidationError>,
    );
  }

  export class ObjectValidationError extends ValidationError {
    constructor(
      valueName: string,
      value: unknown,
      errors: ReadonlyArray<ValidationError>,
    );
  }

  export class ArrayValidationError extends ValidationError {
    constructor(
      valueName: string,
      value: unknown,
      errors: ReadonlyArray<ValidationError>,
    );
  }

  export class UnionError extends ValidationError {
    constructor(
      valueName: string,
      value: unknown,
      errors: ReadonlyArray<ValidationError>,
    );
  }

  type Validator<T> = (name: string, value: unknown) => ValidationError | T;
  export type Get<T extends Validator<any>> = T extends Validator<infer R>
    ? R
    : never;

  export type Contract<T> = {
    (valueName: string): {
      (value: unknown): ValidationError | T;
      optional(value: unknown): ValidationError | void | T;
      maybe(value: unknown): ValidationError | void | null | T;
    };
    (valueName: string, value: unknown): ValidationError | T;

    optional(valueName: string): Validator<T | void>;
    optional(valueName: string, value: unknown): ValidationError | void | T;

    maybe(valueName: string): Validator<T | void | null>;
    maybe(valueName: string, value: unknown): ValidationError | void | null | T;

    mapResult<M>(
      transform: (result: ValidationError | T) => M,
    ): ((valueName: string) => (value: unknown) => M) &
      ((valueName: string, value: unknown) => M);

    match<M>(
      fromValue: (value: T) => M,
      fromError: (error: ValidationError) => M,
    ): ((valueName: string) => (value: unknown) => M) &
      ((valueName: string, value: unknown) => M);
  };

  export function of<T>(validate: Validator<T>): Contract<T>;

  export function array<T extends Array<Validator<any>>>(
    ...rules: T
  ): Contract<ReadonlyArray<Get<T[number]>>>;

  export var isArray: typeof array;
  export var passArray: typeof array;
  export var arr: typeof array;
  export var isArr: typeof array;
  export var passArr: typeof array;

  export var boolean: Contract<boolean>;
  export var isBoolean: typeof boolean;
  export var passBoolean: typeof boolean;
  export var bool: typeof boolean;
  export var isBool: typeof boolean;
  export var passBool: typeof boolean;

  export function literal<T extends string | number | boolean>(
    expectedValue: T,
  ): Contract<T>;

  export var isLiteral: typeof literal;
  export var passLiteral: typeof literal;
  export var lit: typeof literal;
  export var isLit: typeof literal;
  export var passLit: typeof literal;

  export var nul: Contract<null>;
  export var isNull: typeof nul;
  export var passNull: typeof nul;

  export var number: Contract<number>;
  export var isNumber: typeof number;
  export var passNumber: typeof number;
  export var num: typeof number;
  export var isNum: typeof number;
  export var passNum: typeof number;

  export var string: Contract<string>;
  export var isString: typeof string;
  export var passString: typeof string;
  export var str: typeof string;
  export var isStr: typeof string;
  export var passStr: typeof string;

  export function union<
    T extends Array<Validator<any> | string | number | boolean>
  >(
    ...rules: T
  ): Contract<
    | Exclude<T[number], Validator<any>>
    | (Extract<T[number], Validator<any>> extends Validator<any>
        ? Get<Extract<T[number], Validator<any>>>
        : T[number])
  >;

  export var isUnion: typeof union;
  export var passUnion: typeof union;
  export var uni: typeof union;
  export var isUni: typeof union;
  export var passUni: typeof union;

  export var undef: Contract<void>;
  export var isUndefined: typeof undef;
  export var passUndefined: typeof undef;
  export var isUndef: typeof undef;
  export var passUndef: typeof undef;
  export var isVoid: typeof undef;
  export var passVoid: typeof undef;

  export function objectOf<
    T extends Array<Validator<any> | string | number | boolean>
  >(
    ...rules: T
  ): Contract<{
    readonly [key: string]:
      | Exclude<T[number], Validator<any>>
      | (Extract<T[number], Validator<any>> extends Validator<any>
          ? Get<Extract<T[number], Validator<any>>>
          : T[number]);
  }>;

  export var isObjectOf: typeof objectOf;
  export var passObjectOf: typeof objectOf;
  export var objOf: typeof objectOf;
  export var isObjOf: typeof objectOf;
  export var passObjOf: typeof objectOf;

  export function object<
    S extends {
      [prop: string]: (valueName: string, value: unknown) => any;
    }
  >(
    spec: S,
  ): Contract<
    {
      readonly [K in keyof S]: Exclude<ReturnType<S[K]>, ValidationError>;
    }
  >;

  export var isObject: typeof object;
  export var passObject: typeof object;
  export var obj: typeof object;
  export var isObj: typeof object;
  export var passObj: typeof object;

  export function shape<
    S extends {
      [prop: string]: (valueName: string, value: unknown) => any;
    }
  >(
    spec: S,
  ): Contract<
    {
      readonly [K in keyof S]: void | Exclude<
        ReturnType<S[K]>,
        ValidationError
      >;
    }
  >;
}
