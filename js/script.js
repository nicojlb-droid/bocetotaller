/* =========================================================
   RS77 - SCRIPT.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-mobile");
    const backTop = document.querySelector(".back-top");
    const loader = document.querySelector(".loader");

    // Loader
    window.addEventListener("load", () => {
        if (loader) {
            setTimeout(() => loader.classList.add("oculto"), 350);
        }
    });

    // Navbar + botón arriba
    const onScroll = () => {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
        if (backTop) backTop.classList.toggle("visible", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();

    // Menú móvil
    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const active = menu.classList.toggle("active");
            menuButton.classList.toggle("active", active);
            menuButton.setAttribute("aria-expanded", active ? "true" : "false");
        });

        document.querySelectorAll(".menu a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
                menu.classList.remove("active");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight : 0;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: "smooth"
            });
        });
    });

    // Animaciones al entrar en pantalla
    const animated = document.querySelectorAll(".animar,.animar-izquierda,.animar-derecha");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold:.12});
        animated.forEach(el => observer.observe(el));
    } else {
        animated.forEach(el => el.classList.add("visible"));
    }

    // Contadores
    const counters = document.querySelectorAll("[data-contador]");
    const runCounter = el => {
        const target = Number(el.dataset.contador || 0);
        const duration = 1300;
        const start = performance.now();
        const tick = now => {
            const p = Math.min((now-start)/duration, 1);
            const eased = 1 - Math.pow(1-p, 3);
            el.textContent = Math.floor(target*eased).toLocaleString("es-AR");
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window && counters.length) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {threshold:.6});
        counters.forEach(el => counterObserver.observe(el));
    }

    // Volver arriba
    if (backTop) {
        backTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
    }

    // Lightbox de galería
    const photos = [...document.querySelectorAll(".gallery-item img")];
    if (photos.length) {
        let current = 0;

        const box = document.createElement("div");
        box.className = "lightbox";
        box.innerHTML = `
            <button class="lightbox-close" aria-label="Cerrar">×</button>
            <button class="lightbox-prev" aria-label="Anterior">‹</button>
            <figure>
                <img alt="">
                <figcaption></figcaption>
            </figure>
            <button class="lightbox-next" aria-label="Siguiente">›</button>
        `;
        document.body.appendChild(box);

        const show = index => {
            current = (index + photos.length) % photos.length;
            const image = box.querySelector("img");
            const caption = box.querySelector("figcaption");
            image.src = photos[current].src;
            image.alt = photos[current].alt;
            caption.textContent = photos[current].alt;
            box.classList.add("active");
            document.body.style.overflow = "hidden";
        };
        const close = () => {
            box.classList.remove("active");
            document.body.style.overflow = "";
        };

        photos.forEach((img, i) => img.addEventListener("click", () => show(i)));
        box.querySelector(".lightbox-close").addEventListener("click", close);
        box.querySelector(".lightbox-next").addEventListener("click", () => show(current+1));
        box.querySelector(".lightbox-prev").addEventListener("click", () => show(current-1));
        box.addEventListener("click", e => { if (e.target === box) close(); });
        document.addEventListener("keydown", e => {
            if (!box.classList.contains("active")) return;
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") show(current+1);
            if (e.key === "ArrowLeft") show(current-1);
        });
    }

    // WhatsApp
    document.querySelectorAll("[data-whatsapp]").forEach(button => {
        button.addEventListener("click", () => {
            const number = (button.dataset.numero || "").replace(/\D/g, "");
            const message = button.dataset.whatsapp || "";
            if (!number || number === "540000000000") {
                alert("Configurá primero el número de WhatsApp en data-numero dentro de index.html.");
                return;
            }
            window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
        });
    });

    // Año automático
    document.querySelectorAll("[data-anio]").forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    console.log("RS77 V2: sitio iniciado correctamente.");
});
