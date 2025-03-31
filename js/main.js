document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Función para alternar el menú
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevenir scroll cuando el menú está abierto
        document.body.classList.toggle('no-scroll');
    }

    // Event listener para el botón toggle
    navToggle.addEventListener('click', toggleMenu);

    // Cerrar el menú al hacer click en un enlace
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Cerrar el menú al redimensionar la ventana a un tamaño mayor
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Animación de scroll reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Una vez que el elemento se ha revelado, dejamos de observarlo
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionar todos los elementos que queremos animar
    const sections = document.querySelectorAll('.about, .blog, .team, .contact');
    const cards = document.querySelectorAll('.blog-card, .team-member');
    const forms = document.querySelectorAll('.contact-form');
    const footerSections = document.querySelectorAll('.footer-section');

    // Función para inicializar las animaciones
    function initializeRevealAnimations(elements) {
        elements.forEach((element, index) => {
            element.classList.add('reveal');
            // Agregar un delay progresivo para elementos en grid
            if (element.classList.contains('blog-card') || element.classList.contains('team-member')) {
                element.style.transitionDelay = `${index * 0.2}s`; // Aumentado de 0.1s a 0.2s
            }
            observer.observe(element);
        });
    }

    // Inicializar todas las animaciones
    initializeRevealAnimations(sections);
    initializeRevealAnimations(cards);
    initializeRevealAnimations(forms);
    initializeRevealAnimations(footerSections);

    // Asegurarse de que el hero content sea visible
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    // Efecto de gradiente dinámico para el logo
    const navBrand = document.querySelector('.nav-brand');
    let hue = 0;
    let direction = 1;
    let mouseX = 0;
    let mouseY = 0;

    // Función para convertir HSL a RGB y luego a Hex
    function hslToHex(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Función para actualizar el gradiente
    function updateGradient() {
        const baseHue = (hue % 360) / 360;
        const color1 = hslToHex(baseHue, 1, 0.5);
        const color2 = hslToHex((baseHue + 0.1) % 1, 1, 0.5);
        const color3 = hslToHex((baseHue + 0.2) % 1, 1, 0.5);

        navBrand.style.backgroundImage = `linear-gradient(90deg, 
            ${color1}, 
            ${color2}, 
            ${color3}, 
            ${color1})`;

        hue += direction;
        
        // Efecto de velocidad basado en la posición del mouse
        const speed = Math.abs(mouseX) / window.innerWidth * 2;
        hue += speed;

        requestAnimationFrame(updateGradient);
    }

    // Event listeners para el movimiento del mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 2;
        mouseY = (e.clientY - window.innerHeight / 2) / 2;
        
        // Cambiar dirección basado en la posición horizontal del mouse
        direction = mouseX > 0 ? 1 : -1;
    });

    // Iniciar la animación
    updateGradient();

    // Efecto de rejilla Synthwave
    class SynthwaveGrid {
        constructor() {
            this.canvas = document.getElementById('gridCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.lines = [];
            this.gridSize = 50;
            this.perspective = 5;
            this.moveSpeed = 2;
            this.maxLines = 5;
            this.lineSpacing = 100;

            this.resize();
            this.createLines();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.horizonY = this.canvas.height * 0.5;
        }

        createLines() {
            for (let i = 0; i < this.maxLines; i++) {
                this.lines.push({
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height + i * this.lineSpacing,
                    width: 3,
                    color: `hsl(${Math.random() * 60 + 300}, 100%, 50%)` // Colores entre púrpura y rosa
                });
            }
        }

        drawGrid() {
            const ctx = this.ctx;
            ctx.strokeStyle = 'rgba(255, 0, 76, 0.5)'; // Color rojo synthwave
            ctx.lineWidth = 1;

            // Líneas horizontales
            for (let y = this.canvas.height; y > 0; y -= this.gridSize) {
                const scale = (y - this.horizonY) / (this.canvas.height - this.horizonY);
                if (scale < 0) continue;

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(this.canvas.width, y);
                ctx.stroke();
            }

            // Líneas verticales
            for (let x = 0; x < this.canvas.width; x += this.gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, this.canvas.height);
                ctx.lineTo(
                    x + (x - this.canvas.width/2) * this.perspective,
                    this.horizonY
                );
                ctx.stroke();
            }
        }

        drawMovingLines() {
            const ctx = this.ctx;
            
            this.lines.forEach(line => {
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.lineWidth = line.width;
                ctx.moveTo(0, line.y);
                ctx.lineTo(this.canvas.width, line.y);
                ctx.stroke();

                // Mover la línea hacia arriba
                line.y -= this.moveSpeed;

                // Si la línea sale de la pantalla, reiniciarla abajo
                if (line.y < 0) {
                    line.y = this.canvas.height;
                    line.color = `hsl(${Math.random() * 60 + 300}, 100%, 50%)`;
                }
            });
        }

        animate() {
            const ctx = this.ctx;
            ctx.fillStyle = 'rgba(18, 4, 88, 0.1)'; // Color de fondo semi-transparente
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Efecto de desvanecimiento
            ctx.fillStyle = 'rgba(18, 4, 88, 0.2)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawGrid();
            this.drawMovingLines();

            requestAnimationFrame(() => this.animate());
        }
    }

    // Inicializar el efecto cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', () => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
            new SynthwaveGrid();
        }
    });
}); 