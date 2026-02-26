// Lado CMS: escuchar cuando se publica una entrada
// Decap expone event listeners; aquí usamos "entry-published".
if (window.CMS) {
    window.CMS.registerEventListener({
        name: 'entry-published',
        handler: async ({ entry }) => {
            try {
                if (entry?.get('collection') !== 'coursesFile') return;

                // Get the complete data including all fields
                const data = {
                    items: entry.getIn(['data', 'items'], []).toJS().map(item => ({
                        ...item,
                        // Ensure all top-level fields are included
                        showInfo: item.showInfo || false,
                        infoDescription: item.infoDescription || '',
                        showDescription: item.showDescription || false,
                        description: item.description || '',
                        locked: item.locked || true,
                        visible: item.visible !== false, // default to true if not set
                        // Preserve existing modules structure
                        modules: (item.modules || []).map(module => ({
                            ...module,
                            visible: module.visible !== false,
                            exercises: (module.exercises || []).map(exercise => ({
                                ...exercise,
                                visible: exercise.visible !== false,
                                locked: exercise.locked || true
                            }))
                        }))
                    }))
                };

                // Send to your API or save to file
                await fetch('/.netlify/functions/save-courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

            } catch (e) {
                console.error('Error saving course data:', e);
            }
        }
    });
}