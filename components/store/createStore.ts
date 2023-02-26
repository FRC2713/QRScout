import { create } from 'zustand'
import { devtools, persist, PersistOptions } from 'zustand/middleware'

/**
 * Type that marks given fields of a type as non-optional
 */
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * Create a zustand store.
 * @param initialState The initial state of the store
 * @param name The name of the store
 * @param localStorageOptions Local storage will be used if provided.
 * @returns A store
 */
export function createStore<T extends object>(
  initialState: T,
  name: string,
  // Remove `name` from the `PersistOptions` type and add it back later, also make `version` required
  localStorageOptions?: WithRequired<Omit<PersistOptions<T>, 'name'>, 'version'>
) {
  if (localStorageOptions) {
    return create<T>()(
      devtools(
        persist(() => initialState, { ...localStorageOptions, name }),
        { name }
      )
    )
  }

  return create<T>()(devtools(() => initialState, { name }))
}
