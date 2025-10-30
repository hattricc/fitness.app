export default async (req, context) => {
    try {
        // Verifica usuario de Identity (si quieres restringir)
        const user = context?.identity?.token?.email || "anonymous";

        // Datos que te enviamos desde el CMS
        const body = await req.json();
        const { action, courseId, diff } = body;

        // Guarda una línea JSON por evento
        const ts = new Date().toISOString();
        const line = JSON.stringify({ ts, user, action, courseId, diff }) + "\n";

        // Escribe en Netlify Blobs (store "audit")
        const { getStore } = await import("@netlify/blobs");
        const store = getStore("audit"); // nombre lógico del store
        // Append: mantenemos historial
        const prev = (await store.get("changelog.jsonl")) || "";
        await store.set("changelog.jsonl", prev + line);

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
    }
};
