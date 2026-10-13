(function () {
    const depth = location.pathname.split('/').filter(Boolean).length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';

    document.currentScript.insertAdjacentHTML('afterend',
        '<header><nav><ul></ul></nav></header>' +
        '<div class="video-bg">' +
            '<video autoplay muted loop playsinline>' +
                '<source src="' + prefix + 'ascii-loop.mp4" type="video/mp4">' +
            '</video>' +
        '</div>' +
        '<div class="overlay"></div>'
    );
})();
