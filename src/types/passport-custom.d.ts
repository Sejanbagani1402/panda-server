declare module 'passport-custom' {
  import { Request } from 'express';
  import { Strategy } from 'passport';

  interface IStrategyOptions {
    passReqToCallback?: boolean;
  }

  interface IStrategyOptionWithRequest {
    passReqToCallback: true;
  }

  type VerifyFunction = (
    req: Request,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  type VerifyFunctionWithRequest = (
    req: Request,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  export class Strategy extends Strategy {
    constructor(verify: VerifyFunction);
    constructor(options: IStrategyOptions, verify: VerifyFunction);
    constructor(options: IStrategyOptionWithRequest, verify: VerifyFunctionWithRequest);
  }
}
