import { createApp } from "./main";

export default (context) => {
  const { router, store, app } = createApp();
  return new Promise((resolve, reject) => {
    router.push(context.url);
    router.onReady(() => {
      const matchComponents = router.getMatchedComponents();
      if (!matchComponents.length) {
        reject(context);
      }
      Promise.all(
        matchComponents.map((component) => {
          if (component.preFetch) {
            return component.preFetch(store);
          }
        })
      )
        .then(() => {
          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
    });
  });
};
