export type TupleUnion<U extends string, R extends any[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : TupleUnion<Exclude<U, S>, [...R, S]>;
}[U];

export type ActionResponse<T> =
  | {
      data: T;
    }
  | {
      data: never;
      error: {
        message: string;
      };
    };
