/* ============================================================
   1. THREE.JS 3D PARTICLES & TORUS KNOT BACKGROUND
   ============================================================ */
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Floating Wireframe Torus Knot
  const geometry = new THREE.TorusKnotGeometry(9, 2.5, 100, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  // Floating Dust Particles
  const particlesCount = 400;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 80;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x818cf8,
    size: 0.18,
    transparent: true,
    opacity: 0.5
  });
  const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particlesMesh);

  // Parallax Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    torusKnot.rotation.x += 0.002;
    torusKnot.rotation.y += 0.003;

    torusKnot.position.x += (mouseX * 2.5 - torusKnot.position.x) * 0.04;
    torusKnot.position.y += (-mouseY * 2.5 - torusKnot.position.y) * 0.04;

    particlesMesh.rotation.y -= 0.0006;
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ============================================================
   2. GSAP SCROLL & HERO TIMELINE ANIMATIONS
   ============================================================ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Sequence
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTL
    .from('.hero-badge', { opacity: 0, y: -20, duration: 0.7, delay: 0.2 })
    .from('.hero-title', { opacity: 0, y: 35, duration: 0.9 }, '-=0.4')
    .from('.hero-sub', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
    .from('.hero-cta', { opacity: 0, scale: 0.95, duration: 0.5 }, '-=0.3');

  // Animated Number Counters on Scroll
  const counters = document.querySelectorAll('.stat-counter');
  counters.forEach((counter) => {
    const target = +counter.getAttribute('data-target');
    gsap.fromTo(
      counter,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Reveal Cards on Scroll
  gsap.utils.toArray('.skill-card, .project-card').forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%'
      }
    });
  });
}

/* ============================================================
   3. CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    ring.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
  });

  const interactiveElements = document.querySelectorAll('a, button, input, textarea');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ============================================================
   4. PROJECTS FILTERING & MODAL LOGIC
   ============================================================ */
function initProjectsAndModal() {
  // Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-cyan-500', 'text-slate-950');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('bg-cyan-500', 'text-slate-950');
      btn.classList.remove('text-slate-400');

      const filter = btn.getAttribute('data-category');
      projectCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          gsap.to(card, { duration: 0.3, autoAlpha: 1, scale: 1, display: 'flex' });
        } else {
          gsap.to(card, { duration: 0.3, autoAlpha: 0, scale: 0.95, display: 'none' });
        }
      });
    });
  });

  // Modal Setup
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalConfirm = document.getElementById('modal-confirm');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  function openModal(title, desc) {
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
  }

  function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100', 'pointer-events-auto');
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-title'), btn.getAttribute('data-desc'));
    });
  });

  [closeModalBtn, modalConfirm].forEach((el) => {
    if (el) el.addEventListener('click', closeModal);
  });
}

/* ============================================================
   5. MOBILE DRAWER & FORM HANDLER
   ============================================================ */
function initNavigationAndForm() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent successfully.');
      form.reset();
    });
  }
}

// Initialise everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initGSAP();
  initCustomCursor();
  initProjectsAndModal();
  initNavigationAndForm();
});