/**
 * Maanusree S — Portfolio JavaScript
 * Interactive Features: Floating Particle Canvas, 3D Character Effects,
 * Category Filters, Resume Modal, Copy Toast & Smooth Scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initHeroLetters();
  initProjectFilters();
  initResumeModal();
  initCopyActions();
  initContactForm();
  initMobileMenu();
  initYear();
});

/* ==========================================================
   1. Interactive Ambient Particle Canvas (Bluish-Green Palette)
   ========================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Bluish-Green color spectrum
  const colors = [
    'rgba(34, 211, 238, 0.45)', // Cyan
    'rgba(45, 212, 191, 0.45)', // Teal
    'rgba(52, 211, 153, 0.45)', // Emerald
    'rgba(56, 189, 248, 0.45)', // Sky
  ];

  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.2 + 0.8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      this.pulseAngle += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, this.alpha);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting web lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(45, 212, 191, ' + (0.12 * (1 - dist / 110)) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   2. Hero Letters Wave / 3D Character Hover Animation
   ========================================================== */
function initHeroLetters() {
  const nameLetters = document.querySelectorAll('.letter-char');
  nameLetters.forEach((letter, idx) => {
    // Initial entry wave animation delay
    letter.style.animation = `charWave 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${idx * 0.05}s backwards`;

    letter.addEventListener('mouseenter', () => {
      letter.style.transform = 'scale(1.25) rotateY(360deg)';
      letter.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    letter.addEventListener('mouseleave', () => {
      letter.style.transform = 'scale(1) rotateY(0deg)';
      letter.style.transition = 'transform 0.3s ease';
    });
  });
}

/* ==========================================================
   3. Featured Projects Category Filtering
   ========================================================== */
function initProjectFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.figma-project-card');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;

      cards.forEach((card) => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================
   4. Resume Modal & Print View Trigger
   ========================================================== */
function initResumeModal() {
  const openBtn = document.getElementById('open-resume-btn');
  const modal = document.getElementById('modal-resume');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const printBtn = document.getElementById('print-resume-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================
   5. 1-Click Clipboard Copy with Toast Notifications
   ========================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('.copy-action');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`, 'success');
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`, 'success');
      }
    });
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:#2dd4bf;"></i>' : '<i class="fa-solid fa-info-circle"></i>';
  toast.innerHTML = `${icon} <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  }, 3200);
}

/* ==========================================================
   6. Contact Form Interactive Handler (Live Real-Time Email Delivery)
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = document.getElementById('submit-btn-text');
  const btnIcon = document.getElementById('submit-btn-icon');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    // UI Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending Message...';
    if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin';

    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.className = 'form-status-box';
    }

    const payload = {
      name: name,
      email: email,
      _replyto: email,
      _subject: `New Portfolio Message from ${name}: ${subject}`,
      subject: subject,
      message: message,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/maanusree1105@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        if (statusBox) {
          statusBox.style.display = 'flex';
          statusBox.className = 'form-status-box status-success';
          statusBox.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size:1.4rem;"></i> <div><strong>Message Sent Successfully!</strong><br>Thank you for reaching out, Maanusree has received your message and will reply to <em>${email}</em> shortly.</div>`;
        }
        showToast('Message delivered directly to Maanusree\'s inbox!', 'success');
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback triggered:', err);
      
      // Fallback: Open mailto link so the user message is NEVER lost
      const mailtoUrl = `mailto:maanusree1105@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      
      if (statusBox) {
        statusBox.style.display = 'flex';
        statusBox.className = 'form-status-box status-success';
        statusBox.innerHTML = `<i class="fa-solid fa-paper-plane" style="font-size:1.4rem;"></i> <div>Opening your email app to send your message to <strong>maanusree1105@gmail.com</strong>...<br><a href="${mailtoUrl}" target="_blank" style="color:#2dd4bf; text-decoration:underline; font-weight:700;">Click here if your mail app didn't open automatically</a>.</div>`;
      }
      
      window.open(mailtoUrl, '_blank');
      showToast('Opening email client...', 'info');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';
    }
  });
}

/* ==========================================================
   7. Mobile Navigation Toggle
   ========================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isVisible = menu.style.display === 'flex';
      menu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        menu.style.flexDirection = 'column';
        menu.style.position = 'absolute';
        menu.style.top = '100%';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.background = 'rgba(3, 7, 18, 0.95)';
        menu.style.padding = '1.5rem';
        menu.style.borderBottom = '1px solid var(--border-teal-subtle)';
      }
    });

    // Close mobile menu on clicking any link
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 640) {
          menu.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================
   8. Dynamic Year in Footer
   ========================================================== */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
