# Portfolio Tracker Frontend

## Overview

This project is the frontend component of the Portfolio Tracker application, allowing users to manage and track their stock investments. The application is built using **React** and **TypeScript** with state management and API integrations facilitated by **TanStack Query**. Styling is implemented with **Tailwind CSS**.

## Features

- User authentication and session management.
- Add and track stock investments by entering ticker symbols, quantity, and buy price.
- Real-time stock validation via backend APIs.
- Notification system for user feedback on actions.
- Responsive design for seamless use across devices.

## Technology Stack

- **React**: Component-based UI development.
- **TypeScript**: Strongly-typed JavaScript for better maintainability.
- **TanStack Query**: Server-state management for API calls and caching.
- **Tailwind CSS**: Utility-first styling framework.

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HemanthDas/PortfolioTracker-FrontEnd.git
   cd PortfolioTracker-Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and define the following variables:

   ```env
   VITE_BACKEND_URL=http://localhost:8080/api
   VITE_NOTIFICATION_DURATION=3000
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```
   The application will be available at `http://localhost:3000`.

## Folder Structure

```
src/
├── api/                 # API integration functions
├── hooks/               # Custom hooks
├── routes/              # Route definitions
├── assets/              # Static assets like images and fonts
├── context/             # Context providers for global state management
├── utils/               # Utility functions
└── main.tsx             # Application entry point
```

## Deployment

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the contents of the `build/` directory to your hosting provider (e.g., Netlify, Vercel, AWS).

## Hosted URL

The application is deployed on Vercel and can be accessed at [Portfolio Tracker](https://portfolio-tracker-phi-one.vercel.app/auth/login).
or can copy paste the link here:

```
https://portfolio-tracker-phi-one.vercel.app/auth/login
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

For any issues or feature requests, please raise an issue in the repository or contact the development team.
