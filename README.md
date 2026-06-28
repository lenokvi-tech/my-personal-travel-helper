# My Personal Travel Helper

An elegant, full-stack travel planner designed to help you organize your dream destinations, discover cost-saving travel windows, and dynamically estimate costs. Powered securely by Gemini 3.5 Flash, the app fetches curated recommendations for flights, hotels, and tours.

---

## 🗺️ Solution Architecture Diagram

Below is the high-level architecture of **My Personal Travel Helper**, showcasing the visual breakdown of our Client SPA, Secure Proxy Backend, and the AI structured JSON tier:

![Solution Architecture Diagram](./src/assets/images/travel_helper_architecture_1782665020374.jpg)

---

## 🌟 Key Features & Architectural Highlights

- **Full-Stack Architecture**: Built with a production-ready, full-stack design utilizing **React 19 + Vite** on the frontend and an **Express server** on the backend.
- **Secure API Key Management**: All calls to the Gemini API are proxied through server-side endpoints (`/api/travel-insights`). This guarantees that your private `GEMINI_API_KEY` is never exposed to the client-side browser context.
- **Robust Local Storage Persistence**: Dream destinations and their loaded insights are automatically cached in the browser's `localStorage`. Your travel plans are preserved safely across browser sessions without requiring manual database accounts.
- **Structured JSON Generation**: Uses strict typing and JSON schema matching with the Gemini model, ensuring the AI responses are consistently structured, stable, and error-free.
- **Elegant Fallback Behavior**: The application is pre-seeded with stunning default destinations (Kyoto, Japan and Reykjavik, Iceland) to provide an immediate high-fidelity preview on first launch.

---

## 🛠️ Multi-Skills Architecture

This application utilizes advanced agentic coding skills to provide a reliable, high-performance experience:

1. **Gemini API & @google/genai Integration**:
   - Implements the cutting-edge `@google/genai` TypeScript SDK on the server side.
   - Enforces a rigorous `responseSchema` configuration parameter (using `Type.OBJECT`, `Type.ARRAY`, etc.) to structure nested flight, hotel, season, and tour information.
2. **Client-Side Storage State**:
   - Synchronizes deep-nested states for destination items seamlessly across tabs and actions.
   - Leverages `motion` for beautiful state transition animations.

---

## 🎨 User Interface & Experience

The application is framed by a **modern Indigo & Slate theme**, structured around clean grids and generous negative space to minimize planning fatigue.

### 📋 Left Panel: Planner & Dream List
- **Dream Destination Form**: Add custom destinations instantly with optional personal planning notes.
- **Quick Recommendations**: Single-click preset tags for popular world-wide destinations like Bali, Rome, Santorini, and Cape Town.
- **Intuitive Destination Cards**: High-fidelity cards displaying real-time analysis status (Pending, Ready, Analyzing, or Failed) and control buttons to Refresh or Remove.

### 🗺️ Right Panel: AI Travel Hub (Dynamic Tabs)
Once analyzed, the destination content splits into 5 interactive tabs:
1. **When to Go**: Analyzes optimal seasons, average temperatures, crowd density levels, price index ranges, and detailed lists of pros and cons.
2. **Flights**: Suggests estimated round-trip budgets, recommended airlines, optimal months to book, and expert money-saving tips.
3. **Where to Stay**: Recommends the safest/cheapest neighborhoods (categorized by price levels `$` to `$$$`), maps out budget-friendly hotel names with estimated pricing, and suggests alternative lodging hacks.
4. **Tours & Fun**: Displays handpicked sightseeing, food, culture, and nature tours with estimated durations and specific price indicators.
5. **Trip Budget Estimator**:
   - An interactive financial calculator with reactive **Travelers** and **Duration** sliders.
   - Live cost override inputs allowing you to adjust flight, lodging, and daily spending estimates.
   - Checkbox lists to toggle which local tours you want to include in your grand total.
   - Instant calculation of total costs and per-person averages alongside contextual AI budget advice.
