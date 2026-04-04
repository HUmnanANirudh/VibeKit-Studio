# VIBEKIT STUDIO
> Generate a theme, build a mini-site, publish it.

**VibeKit Studio** is a sophisticated, AI-driven mini-site builder that allows users to generate and edit "vibe-based" websites through a natural language interface.

---

## Features

### 1. AI Website Architect (Vibe Assistant)
Natural language page generation and editing powered by **Vercel AI SDK v6**. Modify layouts, generate copy, and apply themes instantly.

### 2. Live Visual Editor
- **Real-time Preview**: Split-screen view with immediate feedback.
- **Responsive Controls**: Test your designs at Desktop (100%), Tablet (768px), and Mobile (375px) widths with animated transitions.
- **Section Management**: Reorder (Up/Down) or delete sections (Hero, Features, Gallery, Contact).

### 3. "Vibe" System (Archetypes 2.0)
Choose from 6 distinct design archetypes, each with unique color tokens, typography scales, spacing, and button styles:
- **Minimal**: High contrast, precise alignment, 'Satoshi' font.
- **Neo-Brutal**: Harsh black borders, 'Cabinet Grotesk', yellow accents.
- **Dark Neon**: Midnight backgrounds, neon borders, 'Space Grotesk'.
- **Pastel Soft**: Rounded (32px), pink gradients, 'Plus Jakarta Sans'.
- **Luxury Serif**: Elegant 'Playfair Display', gold accents, editorial spacing.
- **Retro Pixel**: 8-bit aesthetic, 'JetBrains Mono', vibrant pixel colors.

### 4. Analytics & Contact Submissions
- **Click Tracking**: Every visit is tracked; total and individual view counts are displayed on the dashboard.
- **Message Center**: Fully functional contact form. Submissions are stored in the DB and can be viewed in the "Messages" modal on the dashboard.

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (Full-stack React with Vite)
- **Database (TanStack DB)**: [Neon](https://neon.tech/) (PostgreSQL) using [Drizzle ORM](https://orm.drizzle.tech/) for schema-first data management and TanStack's server-side data fetching patterns.
- **AI Integration (TanStack AI)**: [Vercel AI SDK v6](https://sdk.vercel.ai/) & [OpenRouter](https://openrouter.ai/), integrated via TanStack Start server functions for real-time streaming and tool execution.
- **Styling**: Tailwind CSS v4 (Modern, utility-first)
- **Deployment**: [Netlify](https://www.netlify.com/) (Serverless Functions)
- **Auth**: Secure cookie-based session management with JWT and database persistence.

---

## Authentication & Security

VibeKit Studio implements a robust, production-grade authentication system:
- **Cookie-based Sessions**: Uses a secure `refreshToken` cookie to maintain user sessions without exposing tokens to client-side JavaScript.
- **JWT (JSON Web Tokens)**: Tokens are signed using a server-side `JWT_SECRET`. The system generates a 7-day refresh token upon login.
- **Database-backed Persistence**: Every active session is logged in the `sessions` table in PostgreSQL. This allows for centralized session management and secure revocation.
- **Security Headers**:
  - `httpOnly`: Prevents Cross-Site Scripting (XSS) by making cookies inaccessible to `document.cookie`.
  - `Secure`: Ensures cookies are only sent over HTTPS in production.
  - `SameSite: Strict`: Protects against Cross-Site Request Forgery (CSRF).
- **Password Protection**: All passwords are encrypted using `bcryptjs` with a secure salt before storage.

---

## Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd vite-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   DATABASE_URL=postgres://user:pass@host/db
   JWT_SECRET=your_super_secret_key
   OPENROUTER_API_KEY=your_openrouter_key
   ```

4. **Run in development**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Tradeoffs & Future Fixes

1. **`srcDoc` Preview**: Currently renders the page in an `iframe` using `srcDoc`. This ensures perfect rendering isolation but causes a full reload on every state change. **Next Step**: Implement a message-based partial update system between parent and iframe.
2. **AI SDK v6 Migration**: The rapid migration to SDK v6 used some `as any` types to bypass complex union type overlaps during the streaming response setup. **Next Step**: Fully type the part-based message structure.
3. **Asset Storage**: Gallery images currently use external URLs. **Next Step**: Integrate a cloud storage solution like Uploadthing or Cloudinary for local image uploads.
4. **Drag-and-Drop**: Section reordering is handled via buttons or the AI. **Next Step**: Add [dnd-kit] for a more tactile drag-and-drop experience.
5. **E2E Testing**: No automated visual testing currently exists. **Next Step**: Add Playwright tests to verify that the generated HTML matches the vibey CSS tokens across all 6 archetypes.

---

## 👤 Test User
- **Email**: `test@gmail.com`
- **Password**: `password123`
*(Or feel free to sign up!)*
