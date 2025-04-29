// Blog listing functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with a chronological blog list
    const chronologicalSection = document.querySelector('.chronological');
    if (!chronologicalSection) return;
    
    // Define the list of blog posts manually
    const posts = [
        // 2025 Posts
        { title: "Updates Log", date: new Date("2025-04-13"), path: "updates.md" },
        { title: "Neurodivergence Flavourings as Hackathon Tracks", date: new Date("2025-04-13"), path: "divergence-tracks.md" },
        { title: "Random", date: new Date("2025-04-13"), path: "random.md" },
        { title: "ArXiv Wars", date: new Date("2025-03-16"), path: "arxiv.md" },
        { title: "Cellular automata", date: new Date("2025-03-16"), path: "ca.md" },
        { title: "Misaligned home automation agent", date: new Date("2025-03-09"), path: "automation.md" },
        { title: "Hey moonbeam greeter", date: new Date("2025-03-01"), path: "moonbeam.md" },
        { title: "Fakernews", date: new Date("2025-03-01"), path: "hackernews.md" },
        { title: "Information density graphs", date: new Date("2025-02-28"), path: "info-density.md" },
        { title: "Clustering coefficient", date: new Date("2025-02-28"), path: "clustering.md" },
        { title: "Chain of Thought", date: new Date("2025-02-02"), path: "cot.md" },
        { title: "Growth", date: new Date("2025-01-01"), path: "growth.md" },
        { title: "Echoes", date: new Date("2025-01-20"), path: "echoes.md" },
        { title: "K-Hacks", date: new Date("2025-01-19"), path: "khacks.md" },
        { title: "Images", date: new Date("2025-01-14"), path: "images.md" },
        
        // 2024 Posts
        { title: "2024 Lists", date: new Date("2024-12-31"), path: "lists.md" },
        { title: "Rationality", date: new Date("2024-12-15"), path: "rationality.md" },
        { title: "Drone", date: new Date("2024-11-01"), path: "drone.md" },
        { title: "Ultrasound", date: new Date("2024-10-01"), path: "ultrasound.md" },
        { title: "Work in Progress", date: new Date("2024-06-23"), path: "wip.md" },
        { title: "Rat", date: new Date("2024-06-23"), path: "rat.md" },
        { title: "Underground", date: new Date("2024-05-24"), path: "underground.md" },
        { title: "Swarm", date: new Date("2024-05-14"), path: "swarm.md" },
        { title: "Lightforest", date: new Date("2024-02-22"), path: "lightforest.md" },
        
        // 2023 Posts
        { title: "Hikikomori", date: new Date("2023-10-23"), path: "hiki.md" },
        { title: "Vanishing", date: new Date("2023-07-10"), path: "vanishing.md" },
        { title: "Swarm Intelligence", date: new Date("2023-06-20"), path: "swarm.md" },
        { title: "Seniors", date: new Date("2023-04-14"), path: "seniors.md" },
        { title: "Domestic Violence", date: new Date("2023-03-25"), path: "domestic-violence.md" },
        { title: "Phi", date: new Date("2023-03-05"), path: "phi.md" },
        { title: "Friends", date: new Date("2023-02-26"), path: "friends.md" },
        { title: "Magnify", date: new Date("2023-02-01"), path: "magnify.md" },
        
        // 2022 Posts
        { title: "Education", date: new Date("2022-11-20"), path: "education.md" },
        { title: "Impossible", date: new Date("2022-11-19"), path: "impossible.md" },
        { title: "Overstocking", date: new Date("2022-10-27"), path: "overstocking.md" },
        { title: "Expiration", date: new Date("2022-10-23"), path: "expiration.md" },
        { title: "Brain-Computer Interface", date: new Date("2022-07-10"), path: "bci.md" },
        { title: "Collective Navigation", date: new Date("2022-07-10"), path: "cn.md" },
        { title: "Pollution", date: new Date("2022-03-24"), path: "pollution.md" },
        { title: "Neuralink", date: new Date("2022-01-24"), path: "neuralink.md" },
        
        // 2021 Posts
        { title: "Quantum", date: new Date("2021-09-01"), path: "quantum.md" },
        { title: "Spin", date: new Date("2021-08-02"), path: "spin.md" },
        { title: "Bose-Einstein Condensate", date: new Date("2021-07-29"), path: "bec.md" },
        { title: "Tunneling", date: new Date("2021-07-25"), path: "tunneling.md" },
        { title: "Compton", date: new Date("2021-07-20"), path: "compton.md" },
        { title: "Sources", date: new Date("2021-07-16"), path: "sources.md" },
        
        // 2020 Posts
        { title: "Playful", date: new Date("2020-06-20"), path: "playful.md" },
        { title: "Motivation", date: new Date("2020-04-25"), path: "motivation.md" },
        
        // 2015 Posts
        { title: "Quora", date: new Date("2015-01-01"), path: "quora.md" }
    ];
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => b.date - a.date);
    
    // Clear any existing content in the chronological section except the heading
    const heading = chronologicalSection.querySelector('h2');
    chronologicalSection.innerHTML = '';
    chronologicalSection.appendChild(heading);
    
    // Add each post to the chronological section
    if (posts.length > 0) {
        let currentYear = null;
        
        posts.forEach(post => {
            const postYear = post.date.getFullYear();
            
            // Add year heading if we're in a new year
            if (currentYear !== postYear) {
                currentYear = postYear;
                const yearHeading = document.createElement('h3');
                yearHeading.textContent = postYear;
                chronologicalSection.appendChild(yearHeading);
            }
            
            const postElement = document.createElement('p');
            const link = document.createElement('a');
            // Change the link to point directly to the HTML files instead of using the post.html template
            const postDate = post.date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const postSlug = post.path.replace('.md', '');
            link.href = `/pages/${postDate}-${postSlug}.html`;
            link.textContent = post.title;
            
            // Add date as small text
            const dateSpan = document.createElement('small');
            const monthDay = post.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateSpan.textContent = ` (${monthDay})`;
            
            postElement.appendChild(link);
            postElement.appendChild(dateSpan);
            chronologicalSection.appendChild(postElement);
        });
    } else {
        const noPostsElement = document.createElement('p');
        noPostsElement.textContent = 'No posts found.';
        chronologicalSection.appendChild(noPostsElement);
    }
});
