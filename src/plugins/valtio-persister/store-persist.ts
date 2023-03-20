import { forIn, get, isArray, isBoolean, toString } from 'lodash-es';
import { subscribe } from 'valtio';

import { Persist, PersistStore, StrObj } from './types/storage';

/**
 * @desc 根据store更新state
 * @param state 状态
 * @param store 长存储的值
 * @returns null
 */
function patchState(state: any, store: StrObj | null) {
  if (!store) return;

  forIn(store, (value: any, key: string) => {
    state[key] = value;
    // set(state, key, value);
  });
}

/**
 * @desc 更新storage的数据
 * @param key
 * @param storage
 * @param value
 */
function updateStoreData(key: string, value: any, storage: Storage): void {
  let storageData = '';

  try {
    storageData =
      toString(value) === '[object Object]'
        ? JSON.stringify(value)
        : toString(value);
  } catch (error) {
    storageData = JSON.stringify(value);
  }

  if (storage?.setItem) {
    storage.setItem(key, storageData);
  }
}

/**
 * @desc 多个存储配置更新
 */
function updateStateArrToStorage(
  state: any,
  persistArr: Persist[],
  key: string,
) {
  persistArr.forEach((persistItem: Persist) => {
    const persistKey = persistItem?.key || key;
    const storage = persistItem?.storage || localStorage;
    const paths = persistItem?.paths;

    if (persistItem?.isAll || !paths) {
      updateStoreData(persistKey, JSON.stringify(state), storage);
      return;
    }

    if (paths?.length) {
      const _stateStash = paths.reduce((finalObj: StrObj, key) => {
        finalObj[key] = get(state, key, null);

        return finalObj;
      }, {});

      updateStoreData(persistKey, _stateStash, storage);
    }
  });
}

/**
 * @desc 数据长存储
 * @param state
 * @param persist
 * @param key
 * @returns
 */
function storePersist<T extends object>(
  state: T,
  persist: PersistStore,
  key: string,
): void {
  if (!persist) return;

  // 整体进行存储时
  if (isBoolean(persist) && persist && key) {
    const storageData = localStorage.getItem(key) || '{}';

    const storageResult = JSON.parse(storageData);

    if (storageResult) {
      patchState(state, storageResult);

      updateStoreData(key, state, localStorage);
    }
    // 初始化store的存储
    subscribe(state, () => {
      updateStoreData(key, state, localStorage);
    });

    return;
  }

  if (isBoolean(persist)) return;

  const persistArr = isArray(persist) ? persist : [persist];

  persistArr.forEach((persistItem: Persist) => {
    const persistKey = persistItem?.key || key;
    const storage = persistItem?.storage || localStorage;
    const paths = persistItem?.paths;

    // 获取当前存储的信息
    const storageResult = JSON.parse(storage.getItem(persistKey) as string);

    // 没有paths或者isAll === true 缓存所有的state
    if (persistItem?.isAll || !paths) {
      patchState(state, storageResult);
      updateStoreData(persistKey, state, storage);
      return;
    }

    if (paths?.length) {
      patchState(state, storageResult);
      const _stateStash = paths.reduce((finalObj: StrObj, key) => {
        finalObj[key] = get(state, key, null);

        return finalObj;
      }, {});

      updateStoreData(persistKey, _stateStash, storage);
    }
  });

  subscribe(state, () => {
    updateStateArrToStorage(state, persistArr, key);
  });
}

export { storePersist, updateStoreData };
