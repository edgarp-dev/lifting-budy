// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $index from "./routes/index.tsx";
import * as $login_index from "./routes/login/index.tsx";
import * as $profile_index from "./routes/profile/index.tsx";
import * as $routes from "./routes/routes.ts";
import * as $routines_routineId_exercises_exerciseId_index from "./routes/routines/[routineId]/exercises/[exerciseId]/index.tsx";
import * as $routines_routineId_exercises_exerciseId_routine_exercises_new from "./routes/routines/[routineId]/exercises/[exerciseId]/routine-exercises/new.tsx";
import * as $routines_routineId_exercises_new from "./routes/routines/[routineId]/exercises/new.tsx";
import * as $routines_routineId_index from "./routes/routines/[routineId]/index.tsx";
import * as $routines_index from "./routes/routines/index.tsx";
import * as $routines_new from "./routes/routines/new.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $_islands_AddButton from "./routes/(_islands)/AddButton.tsx";
import * as $_islands_BackButton from "./routes/(_islands)/BackButton.tsx";
import * as $_islands_Breadcrumb from "./routes/(_islands)/Breadcrumb.tsx";
import * as $_islands_RoutineListItem from "./routes/(_islands)/RoutineListItem.tsx";
import * as $routines_islands_FormButtonWithLoader from "./routes/routines/(_islands)/FormButtonWithLoader.tsx";
import * as $routines_islands_OkButton from "./routes/routines/(_islands)/OkButton.tsx";
import * as $routines_islands_RedirectButton from "./routes/routines/(_islands)/RedirectButton.tsx";
import * as $routines_islands_ToggleIsCompleted from "./routes/routines/(_islands)/ToggleIsCompleted.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/index.tsx": $index,
    "./routes/login/index.tsx": $login_index,
    "./routes/profile/index.tsx": $profile_index,
    "./routes/routes.ts": $routes,
    "./routes/routines/[routineId]/exercises/[exerciseId]/index.tsx":
      $routines_routineId_exercises_exerciseId_index,
    "./routes/routines/[routineId]/exercises/[exerciseId]/routine-exercises/new.tsx":
      $routines_routineId_exercises_exerciseId_routine_exercises_new,
    "./routes/routines/[routineId]/exercises/new.tsx":
      $routines_routineId_exercises_new,
    "./routes/routines/[routineId]/index.tsx": $routines_routineId_index,
    "./routes/routines/index.tsx": $routines_index,
    "./routes/routines/new.tsx": $routines_new,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./routes/(_islands)/AddButton.tsx": $_islands_AddButton,
    "./routes/(_islands)/BackButton.tsx": $_islands_BackButton,
    "./routes/(_islands)/Breadcrumb.tsx": $_islands_Breadcrumb,
    "./routes/(_islands)/RoutineListItem.tsx": $_islands_RoutineListItem,
    "./routes/routines/(_islands)/FormButtonWithLoader.tsx":
      $routines_islands_FormButtonWithLoader,
    "./routes/routines/(_islands)/OkButton.tsx": $routines_islands_OkButton,
    "./routes/routines/(_islands)/RedirectButton.tsx":
      $routines_islands_RedirectButton,
    "./routes/routines/(_islands)/ToggleIsCompleted.tsx":
      $routines_islands_ToggleIsCompleted,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
