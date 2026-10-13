(function () {
    const currentPath = location.pathname;

    const links = [
      { href: '/',                 label: 'Main' },
      { href: '/writing',          label: 'Writing' },
      { href: '/me',               label: 'Me' },
      { href: '/gallery',          label: 'Gallery' },
      { href: '/social-graph',     label: 'Social graph' },
    ];

    const html = `
      <nav>
        ${links.map(l => {
          const isExternal = l.href.startsWith('http');
          const href = isExternal ? l.href : l.href;
          
          // Smart detection of active tab supporting both clean URLs and .html extensions
          const isActive = (currentPath === href) || 
                           (href !== '/' && currentPath.startsWith(href.replace('.html', ''))) ||
                           (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === ''));

          return `
          <a href="${href}"${isActive ? ' aria-current="page"' : ''}>
            ${l.label}
          </a>`;
        }).join('')}
        <button class="theme-toggle" title="Toggle light mode">☾</button>
      </nav>`;

    document.currentScript.insertAdjacentHTML('afterend', html);

    document.currentScript.nextElementSibling
      .querySelector('.theme-toggle')
      .addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        this.classList.toggle('active');
        this.textContent = document.body.classList.contains('light-mode') ? '☀' : '☾';
      });
  })();
