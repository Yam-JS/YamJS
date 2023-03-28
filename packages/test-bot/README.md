# ESM Challenges

ESM is a bit of challenge to get to work.

- `jsx`/`tsx` is in a weird state. When trying to import a JSX file, `ts-node` and `tsx` didn't have full support for it.

- We can't use the latest version of ink (v4), as it requires ESM (due to top-level awaits).

- We can't use the latest version of React (v18), as there seems to be a bug with useSyncExternalStore.
