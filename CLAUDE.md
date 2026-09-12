# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start          # start Expo dev server
expo run:ios        # build and run on iOS simulator
expo run:android    # build and run on Android emulator
expo lint           # run ESLint
```

## Architecture

**Djalico** is an Expo / React Native app for online music education, backed by a WordPress REST API at `djalico.com`. Package manager is **yarn**. Routing uses **expo-router** (file-based).

### Route tree

```
app/
├── _layout.tsx              # Root: ThemeProvider + LanguageProvider
├── login.tsx                # Login screen
└── (protected)/
    ├── _layout.tsx          # Auth gate (Stack); currently hardcodes loggedUser = true → redirects to admin
    ├── (tabs)/              # User tab bar: Accueil, Explorer, Mes cours, Sauvegardes, Profil
    ├── (admin)/             # Admin tab bar: Home, Gestion vidéo, Gestion utilisateur, Settings
    └── categorie/           # Browse screens: allParcoursScreen, parcoursScreen, allVideos
```

### Contexts

| File                           | Purpose                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `contexts/authContext.tsx`     | `isLoggedIn`, `isAdmin`, `logIn/logOut` helpers, persisted to AsyncStorage                        |
| `contexts/LanguageContext.tsx` | `t(key)` i18n helper, supports fr/en/es/de/it/pt, persisted to AsyncStorage                       |
| `contexts/api.tsx`             | `logIn(username, password)` (JWT → AsyncStorage) and `fetchUsers()` — calls WordPress WP REST API |

### Color system

Use `config/color.tsx` (named export `color`) for all brand colors in user-facing screens. The admin area defines its own local `COLORS` constants inline. `constants/Colors.ts` is for the light/dark theme system used by expo-router defaults.

### VideoModal

`components/VideoModal.tsx` handles two video types:

- **YouTube URLs** — detected by regex, rendered with `react-native-youtube-iframe`
- **Direct URLs** (mp4, m3u8…) — rendered with `expo-video`'s `VideoView`

### Forms

All forms in the app use **react-hook-form** (`useForm`) paired with **zod** via `@hookform/resolvers/zod` — never hand-rolled `useState` per field + manual `schema.safeParse()` on submit. The established pattern:

- Define the schema with a `makeXSchema(t)` factory (as before) so validation messages stay reactive to language changes, and derive the field type with `z.infer<...>`.
- `useForm<Fields>({ resolver: zodResolver(schema), defaultValues })`, submit via `handleSubmit(onValid, onInvalid)`.
- Wire each input with `<Controller control={control} name="..." render={({ field }) => <Input value={field.value} onChangeText={field.onChange} .../>} />`.
- For a shared component that takes several independent value/setter props at once (e.g. `CategoryLevelPickers`, `DurationField`, `CourseForm`), bridge it with `useController` per field instead of nesting `Controller`s — see the `CategoryLevelPickerFields`/`DurationFields`/`CourseFormFields` helpers in the admin modals for the pattern.
- For array fields used as a selection list (e.g. instrument chips, linked-courses checklist), wrap the whole list in one `Controller` and drive `selected`/toggle logic off `field.value`/`field.onChange` — don't use RHF's `watch()` for this (it trips the `react-hooks/incompatible-library` lint rule); prefer `Controller`/`useController` reads over `watch()` throughout.
- Async default values (e.g. editing an existing record) are populated via `reset(values)` in a `useEffect`, not `useState` initializers.
- When a manual per-field error UI isn't already wired up (older admin modals), fall back to showing the first `handleSubmit` invalid-callback error via `Alert.alert` rather than adding new inline error UI.

### Components/Archives

`components/Archives/` holds old default Expo template components. They are kept for reference but should not be used in new screens. The exception is `HapticTab`, which is still imported by both tab `_layout.tsx` files.

### Current state / known placeholders

- `contexts/api.tsx` `logIn` has an empty fetch URL — the WordPress JWT endpoint is not yet wired
- `(protected)/_layout.tsx` bypasses real auth (`loggedUser = true`) and always redirects to admin
- Home screen data (categories, featured courses, videos) is hardcoded mock data, not fetched from the API

### Prerequisite

- Always ask for validation before implementation
- Always use Tanstack query for interaction that necessite awit and promises. They should always be in the approprieted context
- Always use react-hook-form (+ `@hookform/resolvers/zod`) for forms — see "Forms" under Architecture
