# Naturl 🔗🌳

Naturl is a simple, efficient URL shortener designed with simplicity in mind. Easily shorten URLs without the hassle of creating an account, and enjoy features like instant clipboard copy and custom short codes.

## Features

-   **No Login Required**: Shorten URLs instantly without the need to create an account.
-   **Instant Clipboard Copy**: Shortened URLs are automatically copied to your clipboard for immediate use.
-   **Duplicate Prevention**: If a URL has been shortened before, Naturl will provide the existing short URL instead of creating a new one.
-   **Custom Short Codes**: Optionally specify your own short code for easy-to-remember URLs.
-   **Database Transactions**: Ensures data consistency and prevents race conditions.

## How It Works

1. Enter a long URL into the input field.
2. (Optional) Enter a custom short code.
3. Click the "Shorten" button.
4. The shortened URL is automatically copied to your clipboard.
5. Use and share your shortened URL!

## Technology Stack

-   Next.js
-   TypeScript
-   PostgreSQL
-   Zod

## Getting Started

To run Naturl locally:

1. Clone the repository: `git clone https://github.com/tobiasrasmsn/naturl.git`
2. Navigate to the project directory: `cd naturl`
3. Install dependencies: `npm install`
4. Set up your PostgreSQL database:
    - We recommend using [Neon](https://neon.tech/) for easy setup and management of PostgreSQL databases.
    - Create a new project on Neon and obtain your database connection string.
5. Set up your environment variables:
    - Create a `.env.local` file in the root directory.
    - Add the following variables:
        ```
        DATABASE_URL=your_neon_database_connection_string
        ```
6. Set up your database table:
    - Connect to your Neon database using your preferred SQL client.
    - Run the following SQL command to create the necessary table:
        ```sql
        CREATE TABLE urls (
          id SERIAL PRIMARY KEY,
          original_url TEXT NOT NULL,
          short_code TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          is_custom BOOLEAN DEFAULT false
        );
        ```
7. Run the development server: `npm run dev`
8. Open [http://localhost:3000](http://localhost:3000) in your browser.

Note: Make sure to replace `your_neon_database_connection_string` with the actual connection string from your Neon database.

## Deployment

Naturl is designed to be easily deployed on Vercel. Here's how you can deploy your own instance:

1. Fork this repository to your GitHub account.
2. Sign up for a [Vercel account](https://vercel.com/signup) if you haven't already.
3. In Vercel, click "New Project" and select your forked Naturl repository.
4. In the configuration step, make sure to add your environment variables:
    - Add `DATABASE_URL` with your Neon database connection string.
5. Click "Deploy" and wait for the deployment to complete.

### Using a Custom Domain

To use your own domain with your Naturl instance:

1. In your Vercel dashboard, go to your Naturl project.
2. Navigate to the "Settings" tab, then "Domains".
3. Add your custom domain and follow Vercel's instructions for DNS configuration.
4. Once set up, your Naturl instance will be accessible via your custom domain.

## API Usage

Naturl provides a simple API for URL shortening:

-   Endpoint: `POST /api/shorten`
-   Body:

    ```json
    {
        "url": "https://example.com/very/long/url",
        "shortCode": "custom-code" // Optional
    }
    ```

For any questions, feel free to contact me at hi@tobiasrasmussen.com.
