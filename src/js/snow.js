(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var snowPaused = false;

        function spawnFlake() {
            if (snowPaused) return;
            var el = document.createElement('span');
            el.textContent = '❄';
            el.style.cssText = 'position:fixed;top:-1em;z-index:3;pointer-events:none;'
                + 'font-size:' + (8 + Math.random() * 10) + 'px;'
                + 'left:' + (Math.random() * 100) + 'vw;'
                + 'opacity:' + (0.15 + Math.random() * 0.2) + ';'
                + 'color:#c6d0f5;';
            document.body.appendChild(el);

            var y = -20;
            var x = parseFloat(el.style.left);
            var speed = 0.3 + Math.random() * 0.5;
            var drift = (Math.random() - 0.5) * 0.3;
            var limit = window.innerHeight * 0.8;

            function fall() {
                y += speed;
                x += drift;
                el.style.top = y + 'px';
                el.style.left = x + 'vw';
                if (y < limit) {
                    requestAnimationFrame(fall);
                } else {
                    el.style.transition = 'opacity 0.6s';
                    el.style.opacity = '0';
                    setTimeout(function () { el.remove(); }, 600);
                }
            }
            requestAnimationFrame(fall);
        }

        setInterval(spawnFlake, 400);

        var toggle = document.getElementById('snow-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                snowPaused = !snowPaused;
                this.textContent = snowPaused ? '[ ❄ introduce Arctic weather ]' : "[ It's too cold, stop Arctic weather ]";
            });
        }
    });
})();
