# Buildog (version 0) Roadmap

This roadmap is grouped by themes rather than strict dates so the order can
shift as priorities evolve. Contributions toward any item are welcome — open
an issue or PR on the relevant tracker.

## Vision

- **One product, many sites.** Every account provisions a tenant with its
  own posts, members, theme, and (optionally) custom domain.
- **Theme-driven rendering.** Public sites are rendered server-side from
  Handlebars themes (`.hbs`) over a stable theme API, so creators and
  designers can ship custom looks without touching the app code.
- **Content first.** A focused editor, drafts, scheduling, newsletters, and
  member subscriptions — the building blocks of a modern publication.
- **Open and self-hostable.** The full stack (`apps/buildog` admin,
  `apps/api`, renderer, themes) runs locally with one command.

## Now

Foundational work for the pivot. These items unblock everything else. (Handlesbars just an option, if we want we can use other theme engine as well.)

- **Theme engine (`apps/renderer` + `packages/themes`)**: introduce a new
  rendering service that compiles and serves Handlebars themes. Define the
  theme contract (`package.json` fields, expected templates: `default.hbs`,
  `index.hbs`, `post.hbs`, `tag.hbs`, `author.hbs`, `partials/`, `assets/`).
- **Default theme (`packages/themes/casper-lite`)**: ship a clean,
  responsive starter theme so new sites look good out of the box.
- **Multi-tenant data model (`apps/api`)**: introduce `sites`, `posts`,
  `tags`, `authors`, `members`, `settings` tables scoped per tenant; migrate
  existing single-tenant data.
- **Retire per-site Next.js generation**: remove the project-per-blog
  scaffolding and replace publish flows with writes to the tenant DB +
  cache invalidation on the renderer.
- **Content API v1 (`apps/api`)**: read endpoints (`/posts`, `/posts/:slug`,
  `/tags`, `/authors`, `/settings`) consumed by the renderer and the
  optional `packages/web-sdk`.
- **Admin shell (`apps/buildog`)**: site switcher, post list, editor, and
  basic settings wired to the new API.

## Next

Planned for the cycle after the foundation lands.

- **Custom domains & subdomains**: every tenant gets
  `<slug>.buildog.app` by default; allow attaching a custom domain with
  automatic TLS (Let's Encrypt / Caddy or similar).
- **Drafts, revisions, and scheduling**: persistent draft history, diffing,
  and a background worker that publishes scheduled posts.
- **Media library**: per-tenant asset storage (S3-compatible) with upload,
  search, and reuse from the editor.
- **Theme uploads & validation**: zip upload from the admin, schema
  validation (à la `gscan`), live preview before activation.
- **Members (free tier)**: signup, login (magic link), member-only posts,
  and a basic `{{#if @member}}` helper in themes.
- **Newsletters (basic)**: send a published post to members via an email
  provider integration (Resend / Postmark / SES).

## Later

Larger efforts that depend on the foundation above.

- **Paid memberships & subscriptions**: Stripe integration, monthly/yearly
  tiers, gated content, member portal.
- **Theme marketplace**: discoverable gallery of community themes, install
  with one click.
- **Analytics**: per-post views, referrers, read time, and member
  conversion funnels.
- **Multi-author collaboration**: invitations, roles (owner, editor,
  author, contributor), per-post permissions.
- **Comments & reactions**: opt-in reader engagement on published posts.
- **Webhooks & integrations**: outbound events for publish/update/delete;
  first-party connectors for Slack, Zapier, social platforms.
- **Self-hosting guide**: first-class Docker Compose setup covering
  `apps/buildog`, `apps/api`, `apps/renderer`, database, object storage,
  and reverse proxy.

## Ongoing

Continuous work that is not tied to a single milestone.

- **Editor (`packages/editor`)**: stabilize block-based editing, keyboard
  shortcuts, image uploads, and embeds.
- **UI library (`packages/ui`)**: expand the shadcn/ui-based component set
  used across the dashboard.
- **Performance**: keep dashboard interactions snappy and renderer TTFB
  low (cache compiled templates and content per tenant).
- **Accessibility**: meet WCAG 2.1 AA for the dashboard and the default
  theme's published output.
- **Test coverage**: unit and integration tests across the monorepo,
  including a theme-contract test suite.
- **Developer experience**: faster Turborepo builds, clearer error
  messages, smoother local setup.
- **Docs (`apps/docs`)**: theme authoring guide, Content API reference,
  self-hosting, and migration notes from the pre-pivot architecture.

## Out of scope (for now)

To keep the project focused, the following are explicitly not planned:

- Native mobile apps (the admin targets the web; published sites are
  responsive HTML).
- Generic page builders or e-commerce — Buildog is opinionated toward
  blogs and newsletters.
- A managed hosted offering separate from the open-source project (may
  revisit once self-hosting and themes are mature).
