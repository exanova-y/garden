#!/usr/bin/env python3
import os
import re
import glob

# Get all markdown files
md_files = glob.glob('posts/*.md')

# Create the pages directory if it doesn't exist
os.makedirs('pages', exist_ok=True)

# Process each markdown file
for md_file in md_files:
    # Extract date and slug from filename
    filename = os.path.basename(md_file)
    match = re.match(r'(\d{4}-\d{2}-\d{2})-(.*?)\.md', filename)
    
    if match:
        date_str = match.group(1)
        slug = match.group(2)
        
        # Read markdown content
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Extract title from the first line (assuming it starts with # )
        title = "Post"
        for line in md_content.split('\n'):
            if line.startswith('# '):
                title = line[2:].strip()
                break
        
        # Create HTML file path - directly in the pages directory
        html_filename = f"pages/{date_str}-{slug}.html"
        
        # Escape backticks in markdown content
        escaped_content = md_content.replace('`', '\\`')
        
        # Create the HTML content with the embedded markdown
        html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        /* Base styles */
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f2;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }}

        header {{
            margin-bottom: 40px;
            text-align: right;
        }}

        nav ul {{
            list-style: none;
            display: flex;
            justify-content: flex-end;
            gap: 20px;
        }}

        nav a {{
            text-decoration: none;
            color: #333;
        }}

        nav a:hover {{
            text-decoration: underline;
        }}

        main {{
            margin-bottom: 40px;
        }}

        footer {{
            margin-top: 60px;
            text-align: center;
            font-size: 0.8em;
            color: #777;
        }}

        /* Markdown content styling */
        .markdown-content {{
            max-width: 700px;
            margin: 0 auto;
            padding: 20px 0;
            line-height: 1.7;
        }}

        .markdown-content h1 {{
            font-size: 1.8em;
            margin-bottom: 30px;
            font-weight: normal;
        }}

        .markdown-content h2 {{
            font-size: 1.4em;
            margin-top: 40px;
            margin-bottom: 20px;
            font-weight: normal;
        }}

        .markdown-content h3 {{
            font-size: 1.2em;
            margin-top: 30px;
            margin-bottom: 15px;
            font-weight: normal;
        }}

        .markdown-content p {{
            margin-bottom: 20px;
        }}

        .markdown-content ul, .markdown-content ol {{
            margin-bottom: 20px;
            padding-left: 30px;
        }}

        .markdown-content li {{
            margin-bottom: 8px;
        }}

        .markdown-content blockquote {{
            border-left: 3px solid #ccc;
            padding-left: 20px;
            margin-left: 0;
            color: #555;
            font-style: italic;
            margin-bottom: 20px;
        }}

        .markdown-content img {{
            max-width: 100%;
            height: auto;
            margin: 20px 0;
        }}

        .markdown-content code {{
            font-family: monospace;
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
        }}

        .markdown-content pre {{
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 3px;
            overflow-x: auto;
            margin-bottom: 20px;
        }}

        .markdown-content pre code {{
            background-color: transparent;
            padding: 0;
        }}

        .markdown-content em, .markdown-content i {{
            font-style: italic;
        }}

        .markdown-content strong, .markdown-content b {{
            font-weight: bold;
        }}

        .post-navigation {{
            margin-top: 40px;
            text-align: left;
        }}

        .back-link {{
            text-decoration: none;
            color: #333;
        }}

        .back-link:hover {{
            text-decoration: underline;
        }}

        .footnotes {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
        }}

        .post-metadata {{
            font-style: italic;
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9em;
        }}
    </style>
    <!-- Include the marked.js library for markdown parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.html">home</a></li>
                <li><a href="about.html">about</a></li>
                <li><a href="links.html">link stash</a></li>
                <li><a href="chronological.html">chronological</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="post">
            <div id="content" class="markdown-content">
                <!-- Content will be loaded here -->
                <p>Loading content...</p>
            </div>
            <div class="post-navigation">
                <a href="chronological.html" class="back-link">← Back to all posts</a>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Yoyo cat!</p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            const content = document.getElementById('content');
            
            // The markdown content embedded directly in the page
            const markdown = `{escaped_content}`;
            
            // Render the markdown to HTML using marked.js
            content.innerHTML = marked.parse(markdown);
        }});
    </script>
</body>
</html>
'''
        
        # Write the HTML file
        with open(html_filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"Converted {md_file} to {html_filename}")

print("\nConversion complete!")
