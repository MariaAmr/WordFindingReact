// import type { Middleware } from "redux";
// import type { RootState } from "./store";

// export const authSyncMiddleware: Middleware<{}, RootState> =
//   (store) => (next) => (action) => {
//     // Before state change
//     const prevToken = store.getState().auth.token;
//     const prevUsername = store.getState().auth.username;

//     // Process the action
//     const result = next(action);

//     // After state change
//     const newToken = store.getState().auth.token;
//     const newUsername = store.getState().auth.username;

//     // Sync to localStorage if auth changed
//     if (newToken !== prevToken || newUsername !== prevUsername) {
//       if (newToken && newUsername) {
//         localStorage.setItem("authToken", newToken);
//         localStorage.setItem("username", newUsername);
//       } else {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("username");
//       }
//     }

//     return result;
//   };
