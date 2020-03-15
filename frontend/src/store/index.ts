import rootReducer, { rootSaga } from "./modules";
import { createStore, applyMiddleware, compose, Middleware } from "redux";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

export default function configStore(history: any) {
  const PRELOADED_STATE = (window as any).__PRELOADED_REDUX_STATE__;
  const LOGGER = createLogger();
  const sagaMiddleware = createSagaMiddleware({
    context: {
      history
    }
  });
  const MiddleWares: Middleware[] = [sagaMiddleware];
  process.env.NODE_ENV !== "production" && MiddleWares.push(LOGGER);
  const store =
    process.env.NODE_ENV === "production"
      ? createStore(rootReducer, compose(applyMiddleware(...MiddleWares)))
      : createStore(
          rootReducer,
          PRELOADED_STATE,
          composeWithDevTools(applyMiddleware(...MiddleWares))
        );
  sagaMiddleware.run(rootSaga);
  return store;
}