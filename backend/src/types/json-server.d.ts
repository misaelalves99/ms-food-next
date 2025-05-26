declare module 'json-server' {
  import { Router } from 'express';
  import { RequestHandler } from 'express';

  interface DefaultsOptions {
    static?: string;
    logger?: boolean;
    bodyParser?: boolean;
    readOnly?: boolean;
    noCors?: boolean;
    noGzip?: boolean;
  }

  function router(source?: any): Router;
  function defaults(opts?: DefaultsOptions): RequestHandler;

  export { router, defaults };
  export default { router, defaults };
}
