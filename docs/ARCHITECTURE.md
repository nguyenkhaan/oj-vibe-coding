# Project Folder Structure and Maintainability Rules

## Frontend

~~~text
src/frontend/src/
  app/                 # bootstrap, router, providers, error boundary
  assets/              # static assets
  components/
    layout/            # shells, header, sidebar, footer
  features/
    auth/ courses/ learning/ payment/
    teacher/ admin/ online-judge/ interview/
    each-feature/      # api, types, hooks, components, pages, tests
  pages/               # route-level composition only
  shared/
    ui/                # primitive components
    api/ types/ lib/    # cross-feature contracts/utilities
  test/                # Vitest setup
~~~

Rules:

- Page chỉ compose feature components; không chứa API call hoặc business calculation dài.
- Feature không import private code của feature khác.
- components/ui không import feature code.
- API call nằm trong feature api/service, không nằm trực tiếp trong JSX.
- Component vượt khoảng 150 dòng hoặc file vượt khoảng 300 dòng phải được review để tách.
- `scripts/check-god-files.sh` chạy trong local/CI để chặn các ngưỡng trên.

## Backend

~~~text
src/backend/business-application/src/
  app/                 # FastAPI bootstrap và router wiring
  core/                # settings, security, database, logging
  shared/              # errors, pagination, events, storage, queue
  modules/
    auth/ users/ courses/ learning/
    commerce/ finance/ quiz/ online_judge/
    interview/ moderation/ notifications/
    each-module/       # router, schema, service, repository, policy, tests
  models/              # persistence models theo bounded context
  workers/             # queue consumers và scheduled jobs
~~~

Rules:

- Router chỉ parse request, gọi service và map response.
- Service điều phối use case; repository chứa query/persistence.
- Policy chứa authorization/ownership; worker chỉ nhận job DTO và gọi service.
- Domain module không import ngược router/presentation của module khác.
- File vượt khoảng 400 dòng hoặc service chứa nhiều use case phải được tách.
- Không để App bootstrap, router registry hoặc model __init__ thành god file.

## Review checklist

- File mới thuộc đúng feature/domain.
- Tên file mô tả một responsibility.
- Có test gần cùng module.
- Public export rõ ràng, không deep-import private path.
- Không tạo circular dependency.
