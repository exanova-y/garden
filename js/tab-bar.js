(function () {
    const depth = location.pathname.split('/').filter(Boolean).length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    const links = [
      { href: 'index.html',        label: 'Main' },
      { href: 'quests.html',       label: 'Quests' },
      { href: 'readlogs.html',     label: 'Feral scholar readlogs' },
      { href: 'me.html',           label: 'Me' },
      { href: 'https://wiki.adiabatic.garden', label: 'Wiki (not working yet)' },
      { href: 'social-graph.html', label: 'Social graph' },
    ];

    const html = `
      <div class="tab-bar">
        ${links.map(l => {
          const isExternal = l.href.startsWith('http');
          const href = isExternal ? l.href : prefix + l.href;
          return `
          <a href="${href}" class="tab-link${currentPage === l.href ? ' active' : ''}">
            ${l.label}
          </a>`;
        }).join('')}
        <button class="pane-toggle" title="Toggle pane background">◫</button>
      </div>`;

    document.currentScript.insertAdjacentHTML('afterend', html);

    document.currentScript.nextElementSibling
      .querySelector('.pane-toggle')
      .addEventListener('click', function () {
        const pane = this.closest('.pane');
        pane.classList.toggle('transparent');
        this.classList.toggle('active');
      });
  })();