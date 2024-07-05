import { Pool, PoolClient, QueryResult } from "pg";

let pool: Pool;

if (typeof window === "undefined") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}

export async function query(
    text: string,
    params?: any[]
): Promise<QueryResult> {
    if (!pool) {
        throw new Error("Cannot use database client in browser");
    }
    return pool.query(text, params);
}

export async function getClient(): Promise<PoolClient> {
    if (!pool) {
        throw new Error("Cannot use database client in browser");
    }
    return pool.connect();
}
