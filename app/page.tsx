type Hello = { message: string; now: string };

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/hello", {
    cache: "no-store",
  });
  const data: Hello = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {data.message}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        from postgres at {new Date(data.now).toLocaleString()}
      </p>
    </main>
  );
}
