import { PersistStore } from './types/storage';
import { isObject } from 'lodash-es';
import { proxy } from 'valtio';

import { storePersist } from './store-persist';
export type _Method = (...args: any[]) => any;

type Actions = { [key: string]: _Method };
interface storeParams<T> {
  key: string;
  state: T;
  actions?: Actions;
  persist?: PersistStore;
}

function generateActions<T>(state: T, actions: Actions) {
  const result: any = {};

  Object.keys(actions).forEach((key: string) => {
    result[key] = (...args: any[]) => {
      return (actions[key] as any)(...args, state);
    };
  });

  return result;
}

function generateStore<T extends object>({
  key,
  state,
  actions,
  persist = null,
}: storeParams<T>) {
  if (!isObject(state)) {
    throw new Error('state object required');
  }

  if (!isObject(actions)) {
    throw new Error('actions object required');
  }

  let _actions: any;

  const result: T = proxy({ ...(state as object) }) as T;

  // 处理函数
  if (actions) {
    _actions = generateActions<T>(result, actions);
  }

  // 处理缓存
  if (persist) {
    storePersist(result, persist, key);
  }

  return { state: result, ..._actions };
}

export default generateStore;
