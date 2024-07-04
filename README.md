
# Naturl

Naturl is a simple, efficient URL shortener designed with simplicity in mind.

## Features

- **No Login Required**: Shorten URLs instantly without the need to create an account.
- **Instant Clipboard Copy**: Shortened URLs are automatically copied to your clipboard for immediate use.
- **Duplicate Prevention**: If a URL has been shortened before, Naturl will provide the existing short URL instead of creating a new one.

## How It Works

1. Enter a long URL into the input field.
2. Click the "Shorten" button.
3. The shortened URL is automatically copied to your clipboard.
4. Use and share your shortened URL!

## Technology Stack

- Next.js
- TypeScript
- PostgreSQL (for URL storage)

## Getting Started

To run Naturl locally:
1. Clone the repository: git clone https://github.com/tobiasrasmsn/naturl.git
2. Navigate to the project directory: cd naturl
3. Install dependencies: npm install
4. Set up your PostgreSQL database:
- We recommend using [Neon](https://neon.tech/) for easy setup and management of PostgreSQL databases.
- Create a new project on Neon and obtain your database connection string.
5. Set up your environment variables:
- Create a `.env.local` file in the root directory.
- Add the following variables:
  ```
  DATABASE_URL=your_neon_database_connection_string
  ```
6. Run the development server: npm run dev
7. Open [http://localhost:3000](http://localhost:3000) in your browser.

Note: Make sure to replace `your_neon_database_connection_string` with the actual connection string from your Neon database.
