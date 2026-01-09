if (import.meta.env.USE_MOCKS === 'true') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}
