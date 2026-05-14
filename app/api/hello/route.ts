import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function GET() {
  const rows = await sql<{ message: string; now: Date }[]>`
    SELECT 'hello world' AS message, NOW() AS now
  `;
  return Response.json(rows[0]);
}
