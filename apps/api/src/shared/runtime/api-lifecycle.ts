export interface ShutdownDependencies {
  closeApplication(): Promise<void>;
  disconnectDatabase(): Promise<void>;
}

export const createShutdownHandler = (
  dependencies: ShutdownDependencies,
): (() => Promise<void>) => {
  let shutdown: Promise<void> | undefined;

  return () => {
    shutdown ??= (async () => {
      try {
        await dependencies.closeApplication();
      } finally {
        await dependencies.disconnectDatabase();
      }
    })();
    return shutdown;
  };
};
