# Feature Module Template

Mỗi feature mới dùng một bounded folder, ví dụ `src/features/courses/`:

```text
features/<feature>/
  api/          # API calls and response adapters
  components/   # feature-specific compositions
  hooks/        # feature state/query hooks
  pages/        # route-level feature pages
  tests/        # unit/component tests near the feature
  types.ts      # feature contracts
  index.ts      # intentionally small public exports
```

Pages chỉ compose components; API calls không đặt trong JSX. Shared primitives ở `src/shared/ui` không import code ngược từ feature. Tách module trước khi file hoặc component vượt ngưỡng trong `scripts/check-god-files.sh`.
