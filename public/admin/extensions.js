// Decap CMS extensions
// 'postSave' is the valid event in Decap v3 (replaces deprecated 'entry-published')
// save-courses Netlify function not yet implemented — handler is a no-op for now
if (window.CMS) {
    window.CMS.registerEventListener({
        name: 'postSave',
        handler: ({ collection }) => {
            // Reserved for future save-courses integration
            console.log('[CMS] postSave fired for collection:', collection);
        }
    });
}
