// Markdown support for the minimalist website
document.addEventListener('DOMContentLoaded', async function() {
    // Check if we're on a post page
    const postContent = document.getElementById('post-content');
    if (!postContent) return;
    
    // Get the markdown file path from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const markdownFile = urlParams.get('post');
    
    if (!markdownFile) {
        postContent.innerHTML = '<p>No post specified</p>';
        return;
    }
    
    try {
        // Fetch the markdown file
        // Add ../ to the path if it doesn't already have it to account for pages directory
        const markdownPath = markdownFile.startsWith('../') ? markdownFile : `../${markdownFile}`;
        const response = await fetch(markdownPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load post: ${response.status} ${response.statusText}`);
        }
        
        const markdown = await response.text();
        
        // Render the markdown to HTML
        postContent.innerHTML = marked.parse(markdown);
        
        // Set the page title based on the first h1 heading
        const firstHeading = postContent.querySelector('h1');
        if (firstHeading) {
            document.title = firstHeading.textContent + ' - Minimalist Website';
        }
    } catch (error) {
        console.error('Error loading markdown:', error);
        postContent.innerHTML = `<p>Error loading post: ${error.message}</p>`;
    }
});
