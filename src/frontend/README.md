# React LMS Web Frontend

The React frontend user interface for the LMS Online Coding Platform. It provides pages and features for browsing courses, participating in quizzes, interacting with AI coding interviews, and tracking user profile progress.

---

## Technologies Used

- **React 19**: Modern component library for interactive views.
- **Vite**: Frontend build tool and development server.
- **Tailwind CSS v4**: Modern, high-performance styling engine.
- **TypeScript**: Statically typed JavaScript for safety.
- **Bun**: Fast JavaScript runtime and package manager.

## FE UI Rules

- Desktop content container tối đa `1440px`.
- Không thêm text chỉ để lấp khoảng trống; copy phải phục vụ hành vi hoặc quyết định của người dùng.
- Ưu tiên radius tự nhiên theo component, tránh bo tròn đồng loạt hoặc quá mức.

---

## Folder Structure

Following clean architectural patterns for React:

```text
src/
├── app/            # Router, providers, guards and error boundary
├── components/     # Layout shells and feature composition
├── features/       # Bounded feature modules; see features/README.md
├── pages/          # Route-level composition only
├── shared/         # UI primitives, API contracts and cross-feature types
├── test/           # Vitest setup
├── App.tsx         # Error-boundary and router composition
├── index.css       # Theme tokens and responsive foundation
└── main.tsx        # React client bootstrap entry point
```

---

## Getting Started & Setup

Ensure you have **Bun** installed as the primary runtime.

### Step 1: Install Dependencies

Navigate to the frontend folder and install:

```bash
cd src/frontend
bun install
```

### Step 2: Run Development Server

Run Vite's local hot-reloaded dev environment:

```bash
bun run dev
```

The application will launch on [http://localhost:5173](http://localhost:5173).

### Step 3: Production Build

Verify typescript checks and bundle the app:

```bash
# Compile and build production assets
bun run build

# Preview the built production output locally
bun run preview
```

---

## Utility Commands

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `bun run dev`     | Starts Vite's dev server on port `5173`                |
| `bun run build`   | Compiles code with `tsc` and bundles production assets |
| `bun run preview` | Spins up local HTTP server to preview `/dist` output   |
| `bun run lint`    | Lints typescript and React hooks syntax with ESLint    |
| `bun run test`    | Runs Vitest unit/component tests                       |
| `bun run e2e`     | Runs Playwright browser smoke tests                    |
| `bun run check:architecture` | Checks god-file size thresholds              |
