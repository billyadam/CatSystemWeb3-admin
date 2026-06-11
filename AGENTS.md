# Source Folder Structure

This is the **admin panel** for OLPaw. It is a separate app from the user-facing frontend. Key differences:
- Authentication uses wallet-only login (no Google OAuth) via `POST /admin/web3`
- Current user is loaded via `GET /admin/me`
- No onboarding flow — admins are assumed to be pre-configured
- Pages are limited to admin-relevant routes only (no marketplace, messaging, notifications, or cat registration)
- Runs on port **3005**

All application code lives under `src/`. Here is what each folder is for and where to put new things.

---

## `src/app/`
Next.js App Router. Each `page.tsx` here is a **thin wrapper only** — it imports a page component from `src/components/pages/` and renders it, nothing else. No logic or JSX beyond that belongs here.

## `src/components/`
Every React component that returns HTML goes here, organized into subfolders:

### `components/layout/`
Structural chrome shared across all pages: the root `Layout` wrapper and the `Navbar` + `NavItemButton`. If you are adding or changing navigation or the page shell, this is where it goes.

### `components/pages/`
Full page-level components, one subfolder per route, mirroring the `app/` structure.
- `pages/home/` → `/`
- `pages/account/` → `/account`
- `pages/login/` → `/login`

When adding a new route: create a subfolder here with the page component, then import it from the corresponding `app/` page file.

### `components/cat/`
Domain components specific to the cat entity: `CatCard` and the detail tabs (`BioTab`, `DNATab`, `HealthTab`, `FamilyTab`, `OwnerTab`). Cat-related reusable UI that is not a full page goes here.

### `components/ui/`
Generic, reusable, page-agnostic primitives with no domain knowledge:
- `button/` — Button
- `form/` — Input, SelectInput, FilePreview, ErrorMessage, HelperText, LabelText, LabelText
- `table/` — Table, THead, TBody, TOption, Filter, PaginationControl
- `Typography.tsx`, `LightboxModal.tsx`, `UnstyledLink.tsx`

If a component could be copy-pasted into any other project and still make sense, it belongs in `ui/`.

### `components/hoc/`
Higher-order components. Currently contains `withAuth`, which wraps a page component with role-based access control.

### `components/GoogleAnalytics.tsx`
Analytics script injection. Lives at the top level of `components/` since it is a one-off utility component used only in the root layout.

---

## `src/config/`
Static app configuration. Currently `nav.ts` defines the navigation items used by the Navbar.

## `src/hooks/`
Custom React hooks for data fetching and mutations (React Query). One hook per concern, e.g. `useGetMyCats`, `useAuthLogin`.

## `src/lib/`
Non-React utilities: API client (`api.ts`), cookie helpers, pagination helpers, Solana program integration, and the Anchor IDL. No React here.

## `src/types/`
TypeScript type definitions shared across the app. One file per domain (`cat.ts`, `user.ts`, `registerCat.ts`, etc.).
