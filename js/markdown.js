// Markdown support for the minimalist website
document.addEventListener('DOMContentLoaded', async function() {
    // Check if we're on a post page
    const postContent = document.getElementById('post-content');
    if (!postContent) return;
    
    // Initialize marked with the footnote extension if available
    if (typeof markedFootnote !== 'undefined') {
        marked.use(markedFootnote());
    }
    
    // Get the markdown file path from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const markdownFile = urlParams.get('post');
    
    if (!markdownFile) {
        postContent.innerHTML = '<p>No post specified</p>';
        return;
    }
    
    try {
        // Fetch the markdown file
        const response = await fetch(`/posts/${markdownFile}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load post: ${response.status} ${response.statusText}`);
        }
        
        const markdown = await response.text();
        
        // Render the markdown to HTML
        postContent.innerHTML = marked.parse(markdown);
        
        // Set the page title based on the first h1 heading
        const firstHeading = postContent.querySelector('h1');
        if (firstHeading) {
            document.title = firstHeading.textContent + ' - Yoyo is spinning';
        }

        // Update the URL to remove the query parameter and make it cleaner
        const cleanPath = markdownFile.replace('.md', '');
        window.history.replaceState({}, document.title, `/posts/${cleanPath}`);
    } catch (error) {
        console.error('Error loading markdown:', error);
        postContent.innerHTML = `<p>Error loading post: ${error.message}</p>`;
    }
});
