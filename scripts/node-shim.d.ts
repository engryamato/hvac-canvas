declare module 'fs';
declare module 'path';
declare module 'child_process';
declare const process: {
  cwd(): string;
  env: Record<string, string | undefined>;
  hrtime: {
    bigint(): bigint;
  };
  exitCode?: number;
};
