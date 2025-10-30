// Lado CMS: escuchar cuando se publica una entrada
// Decap expone event listeners; aquí usamos "entry-published".
if (window.CMS) {
    window.CMS.registerEventListener({
        name: 'entry-published',
        handler: async ({ entry }) => {
            try {
                // Solo procesamos nuestra colección/archivo
                if (entry?.get('collection') !== 'coursesFile') return;

                // Ejemplo simple de "diff": enviamos todo el contenido
                const data = entry?.get('data')?.toJS?.() || {};
                // Puedes calcular un diff más fino si quieres (último curso editado, etc.)

                await fetch('/.netlify/functions/log-change', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'publish',
                        courseId: null, // si controlas cuál se tocó, envíalo aquí
                        diff: data
                    })
                });
            } catch (e) {
                console.error('Audit log failed', e);
            }
        }
    });
}
