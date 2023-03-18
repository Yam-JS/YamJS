# Legacy

All files within this repository are from Grakkit, however, were built around Grakkit v1 types, which created a significant typedef limitation.

# Moving Forward

The goal is to eliminate legacy altogether.

- As we refactor more legacy into core, we'll remove that legacy code. Upcoming minor versions may see missing legacy functions, which is intended, until the full removal of legacy.

- Legacy may see improvements during the development of YamJS, in order to bring it up to standards. For example, error handling within legacy will now ue YamJS error handling.

- No new features will be added to legacy.
