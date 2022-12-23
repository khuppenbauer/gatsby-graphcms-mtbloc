export const onServiceWorkerUpdateReady = () => {
  window.location.reload();
};

export const onRouteUpdate = () => {
  if (
    process.env.NODE_ENV === `production` &&
    typeof window.plausible !== `undefined`
  ) {
    window.plausible(`pageview`)
  }
}