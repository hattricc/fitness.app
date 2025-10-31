// Handle invite token redirection
if (window.netlifyIdentity) {
    // Handle invite tokens in URL
    if (window.location.hash.includes('invite_token')) {
        window.netlifyIdentity.on('init', user => {
            if (!user) {
                window.netlifyIdentity.open('signup');
            }
        });
    }

    // Reload after login to ensure CMS picks up the session
    window.netlifyIdentity.on('login', () => {
        window.location.href = '/admin/';
    });
}