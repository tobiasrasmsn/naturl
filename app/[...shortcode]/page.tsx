import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export default async function ShortCodePage({
    params,
}: {
    params: { shortcode: string[] };
}) {
    const shortCode = params.shortcode[0];

    if (!shortCode) {
        redirect("/");
    }

    const result = await query(
        "SELECT original_url FROM urls WHERE short_code = $1",
        [shortCode]
    );

    if (result.rows.length === 0) {
        redirect("/");
    }

    const originalUrl = result.rows[0].original_url;

    redirect(originalUrl);
}
