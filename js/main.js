/**
 * Power Soft Global Solutions - Master JavaScript Engine
 * Handles interactive hero canvas, live cost estimator, filters,
 * stats counters, theme switching, modal drawers, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollEffects();
  initHeroCanvas();
  initStatsCounter();
  initServiceFilters();
  initCostEstimator();
  initTechTabs();
  initFaqAccordion();
  initCaseStudyModals();
  initContactForm();
  initMobileNav();
});

/* ==========================================================================
   1. Theme Management (Defaults to Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  
  // Explicitly default to Light Mode
  let savedTheme = localStorage.getItem('ps_theme');
  if (!savedTheme || savedTheme === 'dark') {
    savedTheme = 'light';
  }
  
  applyTheme(savedTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ps_theme', theme);

  const themeIcons = document.querySelectorAll('.theme-icon-slot');
  themeIcons.forEach(icon => {
    if (theme === 'light') {
      // In light mode, show Moon icon to switch to Dark
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else {
      // In dark mode, show Sun icon to switch to Light
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  });
}

/* ==========================================================================
   2. Scroll Effects (Progress Bar, Sticky Nav, Back to Top)
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.main-header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    if (progressBar) progressBar.style.width = scrolled + '%';

    if (winScroll > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (winScroll > 500) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   3. Interactive Hero Canvas (Adapts to Light & Dark Theme)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const maxDistance = 140;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(0, 242, 254, 0.8)` : `rgba(2, 132, 199, 0.7)`;
      ctx.shadowBlur = isDark ? 8 : 4;
      ctx.shadowColor = isDark ? `rgba(0, 242, 254, 0.9)` : `rgba(2, 132, 199, 0.3)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.32);
          ctx.strokeStyle = isDark ? `rgba(0, 242, 254, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   4. Stats Animated Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = target % 1 === 0 
            ? Math.floor(easeProgress * target) 
            : (easeProgress * target).toFixed(1);

          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }
        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   5. Filterable Services Grid & Modal Deep Dive
   ========================================================================== */
const serviceData = {
  'it-consulting': {
    title: 'IT Consulting & Enterprise Modernization',
    category: 'Architecture & Strategy',
    description: 'We help global enterprises overcome technical debt, re-architect monolithic systems into agile cloud-native microservices, and build scalable digital transformation roadmaps.',
    deliverables: [
      'Comprehensive Cloud & Legacy Architecture Audit',
      'Target-State Solution Blueprints & Multi-Year Roadmap',
      'Cost & Cloud Resource Optimization (FinOps)',
      'Enterprise Technology Stack Migration Roadmaps',
      'Governance, SLA Frameworks & Disaster Recovery Planning'
    ],
    tech: ['Enterprise AWS/Azure', 'Kubernetes', 'Terraform', 'Microservices', 'Zero-Trust Architecture'],
    timeframe: '2 - 6 Months Engagements'
  },
  'data-analytics': {
    title: 'Data Analytics & Business Intelligence',
    category: 'Insights & Big Data',
    description: 'Transform raw data into real-time competitive advantages. We design scalable data lakes, automated ETL streaming pipelines, and executive dashboards that drive data-backed decisions.',
    deliverables: [
      'Modern Data Warehouse Architecture (Snowflake, Databricks)',
      'End-to-End Automated Real-time ETL / ELT Pipelines',
      'Executive Power BI & Tableau Dashboards with Live Telemetry',
      'Predictive Machine Learning Customer & Revenue Models',
      'Data Governance, Privacy (GDPR/HIPAA) & Master Data Management'
    ],
    tech: ['Snowflake', 'Databricks', 'Apache Spark', 'Power BI', 'Tableau', 'dbt', 'Python'],
    timeframe: '4 - 12 Weeks MVP to Scale'
  },
  'digital-marketing': {
    title: 'Digital Marketing & Growth Engineering',
    category: 'Acquisition & Revenue',
    description: 'Data-driven performance marketing engineered for exponential customer acquisition, high-converting organic SEO footprints, and maximized return on advertising spend (ROAS).',
    deliverables: [
      'Multi-Touch Attribution & Full-Funnel Performance Marketing',
      'Enterprise Technical & Programmatic SEO Architecture',
      'Conversion Rate Optimization (CRO) & Continuous A/B Experimentation',
      'Omnichannel Paid Media Campaigns (Google Ads, Meta, LinkedIn, B2B ABM)',
      'Marketing Automation, CRM Integration & Lifecycle Retention Funnels'
    ],
    tech: ['Google Analytics 4', 'Hubspot', 'Segment CDP', 'Semrush', 'Mixpanel', 'Looker Studio'],
    timeframe: 'Monthly Retainers & Sprint Deliverables'
  },
  'custom-software': {
    title: 'Custom Software & Web Platforms',
    category: 'Full-Stack Engineering',
    description: 'Tailor-crafted web applications, SaaS platforms, and enterprise portals engineered with high availability, modern UX, and resilient security from line one of code.',
    deliverables: [
      'Custom B2B SaaS Platform Engineering & API Ecosystems',
      'High-Performance Web Applications & Responsive Portals',
      'Secure Third-Party API Integrations & Microservice Mesh',
      'Automated CI/CD DevOps Pipeline Implementation',
      'Rigorous Unit, Integration & Load Testing Suites'
    ],
    tech: ['React / Next.js', 'Node.js', 'Go', 'Python FastAPI', 'PostgreSQL', 'Docker'],
    timeframe: '8 - 24 Weeks Sprints'
  },
  'ai-automation': {
    title: 'AI, Machine Learning & Automation',
    category: 'Next-Gen Intelligence',
    description: 'Harness the cutting-edge of Generative AI, intelligent document processing, and autonomous workflow automation to eliminate manual friction across operations.',
    deliverables: [
      'Private Custom LLMs & Retrieval-Augmented Generation (RAG) Systems',
      'Intelligent Process Automation (IPA) & Robotic Workflow Agents',
      'Computer Vision & Natural Language Sentiment Analyzers',
      'Predictive Churn, Lifetime Value & Demand Forecasting Algorithms',
      'AI Safety, Guardrails & Model Monitoring Infrastructure'
    ],
    tech: ['OpenAI / Anthropic APIs', 'LangChain', 'LlamaIndex', 'PyTorch', 'Vector DBs (Pinecone/Weaviate)'],
    timeframe: '6 - 16 Weeks Implementations'
  },
  'cybersecurity': {
    title: 'Cloud & Zero-Trust Cybersecurity',
    category: 'Security & DevOps',
    description: 'Shield enterprise assets with impenetrable zero-trust security postures, automated continuous compliance audits, and proactive vulnerability remediation.',
    deliverables: [
      'Full Infrastructure Penetration Testing & Vulnerability Assessment',
      'SOC 2 Type II, ISO 27001 & HIPAA Readiness & Compliance Support',
      'Zero-Trust Identity & Access Management (IAM) Integration',
      'Cloud Security Posture Management (CSPM) & Threat Monitoring',
      'Incident Response Protocols & Automated Threat Mitigation'
    ],
    tech: ['AWS Security Hub', 'Cloudflare Zero Trust', 'HashiCorp Vault', 'Okta', 'CrowdStrike'],
    timeframe: 'Continuous Retainer & Scheduled Audits'
  }
};

function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Service Trigger
  const modalTriggers = document.querySelectorAll('.service-modal-trigger');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = trigger.getAttribute('data-service');
      openServiceModal(serviceKey);
    });
  });
}

function openServiceModal(key) {
  const service = serviceData[key];
  if (!service) return;

  const modalOverlay = document.getElementById('serviceDetailModal');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalCategory = document.getElementById('modalServiceCategory');
  const modalDesc = document.getElementById('modalServiceDesc');
  const modalDeliverables = document.getElementById('modalServiceDeliverables');
  const modalTech = document.getElementById('modalServiceTech');
  const modalTimeframe = document.getElementById('modalServiceTimeframe');

  if (modalTitle) modalTitle.textContent = service.title;
  if (modalCategory) modalCategory.textContent = service.category;
  if (modalDesc) modalDesc.textContent = service.description;
  if (modalTimeframe) modalTimeframe.textContent = service.timeframe;

  if (modalDeliverables) {
    modalDeliverables.innerHTML = service.deliverables.map(item => `
      <li style="display:flex; align-items:center; gap:10px; margin-bottom:10px; font-size:0.95rem; color:var(--text-main);">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ${item}
      </li>
    `).join('');
  }

  if (modalTech) {
    modalTech.innerHTML = service.tech.map(tech => `
      <span style="display:inline-block; padding:4px 12px; border-radius:99px; background:rgba(2,132,199,0.08); border:1px solid rgba(2,132,199,0.2); color:var(--accent-cyan); font-size:0.82rem; font-weight:600; font-family:var(--font-mono); margin:3px 4px 3px 0;">
        ${tech}
      </span>
    `).join('');
  }

  // Pre-fill select in contact form if user clicks "Request Proposal for this"
  const modalInquireBtn = document.getElementById('modalInquireBtn');
  if (modalInquireBtn) {
    modalInquireBtn.onclick = () => {
      closeAllModals();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Check corresponding checkbox in form
        const matchingCheck = document.querySelector(`.form-service-checkbox input[value="${key}"]`);
        if (matchingCheck) matchingCheck.checked = true;
      }
    };
  }

  modalOverlay?.classList.add('active');
}

/* ==========================================================================
   6. Interactive Project Cost & Scope Estimator
   ========================================================================== */
function initCostEstimator() {
  const serviceCheckboxes = document.querySelectorAll('.estimator-service-check');
  const scaleRadios = document.querySelectorAll('input[name="estimator-scale"]');
  const timelineSlider = document.getElementById('estimatorTimeline');
  const timelineVal = document.getElementById('timelineVal');
  const teamSlider = document.getElementById('estimatorTeam');
  const teamVal = document.getElementById('teamVal');

  const priceOutput = document.getElementById('estimatedPriceRange');
  const summaryServicesCount = document.getElementById('summaryServicesCount');
  const summaryScale = document.getElementById('summaryScale');
  const summaryTimeline = document.getElementById('summaryTimeline');
  const summaryTeam = document.getElementById('summaryTeam');
  const lockEstimateBtn = document.getElementById('lockEstimateBtn');

  function calculateEstimate() {
    let basePricePerMonth = 0;
    let selectedServices = [];

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        selectedServices.push(cb.value);
        basePricePerMonth += parseInt(cb.getAttribute('data-base-cost') || '4500');
      }
    });

    if (selectedServices.length === 0) {
      basePricePerMonth = 5000; // minimum baseline
    }

    // Scale multiplier
    let scaleMultiplier = 1.0;
    let scaleName = 'Growth Scale';
    scaleRadios.forEach(radio => {
      if (radio.checked) {
        scaleMultiplier = parseFloat(radio.getAttribute('data-multiplier') || '1.0');
        scaleName = radio.getAttribute('data-scale-name') || 'Growth Scale';
      }
    });

    const months = parseInt(timelineSlider?.value || '3');
    const teamSize = parseInt(teamSlider?.value || '4');

    if (timelineVal) timelineVal.textContent = `${months} ${months === 1 ? 'Month' : 'Months'}`;
    if (teamVal) teamVal.textContent = `${teamSize} Specialists`;

    // Dynamic cost equation
    const calculatedTotal = (basePricePerMonth * (0.6 + teamSize * 0.15) * scaleMultiplier * Math.max(1, months * 0.85));
    const minRange = Math.round(calculatedTotal * 0.85 / 500) * 500;
    const maxRange = Math.round(calculatedTotal * 1.2 / 500) * 500;

    const formattedMin = '$' + minRange.toLocaleString();
    const formattedMax = '$' + maxRange.toLocaleString();

    if (priceOutput) {
      priceOutput.textContent = `${formattedMin} - ${formattedMax}`;
    }

    if (summaryServicesCount) summaryServicesCount.textContent = `${selectedServices.length} Selected`;
    if (summaryScale) summaryScale.textContent = scaleName;
    if (summaryTimeline) summaryTimeline.textContent = `${months} ${months === 1 ? 'Month' : 'Months'}`;
    if (summaryTeam) summaryTeam.textContent = `${teamSize} Dedicated`;

    return {
      priceRange: `${formattedMin} - ${formattedMax}`,
      selectedServices,
      scaleName,
      months,
      teamSize
    };
  }

  // Event Listeners
  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));
  scaleRadios.forEach(r => r.addEventListener('change', calculateEstimate));
  timelineSlider?.addEventListener('input', calculateEstimate);
  teamSlider?.addEventListener('input', calculateEstimate);

  // Initial calculation
  calculateEstimate();

  // "Lock In Estimate" Button Action
  lockEstimateBtn?.addEventListener('click', () => {
    const est = calculateEstimate();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });

      // Auto-populate services in the contact form
      document.querySelectorAll('.form-service-checkbox input').forEach(input => {
        if (est.selectedServices.includes(input.value)) {
          input.checked = true;
        }
      });

      // Populate project details textarea with blueprint summary
      const messageField = document.getElementById('contactMessage');
      if (messageField) {
        messageField.value = `[Estimator Blueprint Request]\nEstimated Budget: ${est.priceRange}\nScale Tier: ${est.scaleName}\nTarget Timeline: ${est.months} Months\nRecommended Team: ${est.teamSize} Specialists\nInterested Tracks: ${est.selectedServices.join(', ')}\n\nHello Power Soft Team, please provide a formal proposal and schedule an architecture discovery session based on this scope.`;
      }

      showToast('Estimator blueprint attached to your consultation request!', 'success');
    }
  });
}

/* ==========================================================================
   7. Technology Stack Categorical Tabs
   ========================================================================== */
function initTechTabs() {
  const tabs = document.querySelectorAll('.tech-tab-btn');
  const items = document.querySelectorAll('.tech-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-tech-cat');
        if (targetCategory === 'all' || itemCat === targetCategory) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => other.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. Case Study Modals & Video Overview
   ========================================================================== */
const caseStudyData = {
  'fintech': {
    title: 'FinTech MegaBank: Real-Time Fraud & Cloud Streaming',
    client: 'Global Apex Bank Corp',
    results: '40,000 tx/sec throughput, 99.999% SLA uptime, 74% reduction in fraud detection latency',
    body: 'Apex Bank was struggling with legacy mainframe batch processing that delayed fraud alerts by up to 45 minutes. Power Soft Global Solutions architected a cloud-native real-time event streaming pipeline using Apache Kafka, Snowflake, and predictive AI models on AWS. The solution instantly classifies high-risk transactions within 12 milliseconds.'
  },
  'ecommerce': {
    title: 'OmniRetail: 240% Organic Traffic & 3.4x Conversion Scaling',
    client: 'OmniRetail Global Brands',
    results: '+240% Organic Search Traffic, 3.4x E-Commerce Conversion Rate, $38M incremental sales',
    body: 'Power Soft’s Digital Marketing & Growth Engineering team completed an exhaustive technical SEO overhaul, implemented multi-touch attribution, and engineered dynamic personalized landing pages with automated A/B conversion funnels.'
  },
  'healthtech': {
    title: 'NovaHealth: HIPAA-Compliant Microservice Migration',
    client: 'NovaHealth Integrated Network',
    results: 'Zero downtime migration across 4.2M patient records, SOC2 & HIPAA certified architecture',
    body: 'Transitioned a complex 10-year-old monolithic healthcare portal to a modern containerized microservice mesh on Microsoft Azure with zero-trust encryption and automated disaster recovery.'
  }
};

function initCaseStudyModals() {
  const caseButtons = document.querySelectorAll('.case-study-trigger');
  const modal = document.getElementById('caseStudyModal');
  const modalTitle = document.getElementById('caseModalTitle');
  const modalClient = document.getElementById('caseModalClient');
  const modalResults = document.getElementById('caseModalResults');
  const modalBody = document.getElementById('caseModalBody');

  caseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const studyKey = btn.getAttribute('data-case');
      const data = caseStudyData[studyKey];

      if (data && modal) {
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalClient) modalClient.textContent = `Client: ${data.client}`;
        if (modalResults) modalResults.textContent = data.results;
        if (modalBody) modalBody.textContent = data.body;
        modal.classList.add('active');
      }
    });
  });

  // Video Overview Modal Trigger
  const videoBtn = document.getElementById('watchOverviewBtn');
  const videoModal = document.getElementById('videoOverviewModal');
  if (videoBtn && videoModal) {
    videoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('active');
    });
  }

  // Generic close modal bindings
  document.querySelectorAll('.modal-close-btn, .modal-backdrop-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

/* ==========================================================================
   10. Consultation & Contact Form with Interactive Feedback
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('consultationForm');
  const submitBtn = document.getElementById('submitContactBtn');
  const successModal = document.getElementById('successConfirmationModal');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields (Name, Corporate Email, Message).', 'error');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('Please enter a valid corporate email address.', 'error');
      return;
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" style="animation: spin 1s linear infinite; width:18px; height:18px; margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
        </svg>
        Securing Transmission...
      `;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Submit Consultation Request</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }

      contactForm.reset();
      const ticketId = 'PSG-' + Math.floor(100000 + Math.random() * 900000);
      const ticketElem = document.getElementById('confirmationTicketId');
      if (ticketElem) ticketElem.textContent = ticketId;

      successModal?.classList.add('active');
      showToast('Consultation request transmitted successfully!', 'success');
    }, 1200);
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value.trim();
    if (email) {
      showToast(`Thank you! ${email} has been subscribed to Enterprise Tech Insights.`);
      newsletterForm.reset();
    }
  });
}

/* ==========================================================================
   11. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   12. Notification Toast Engine
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';

  let icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `;

  if (type === 'success') {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === 'error') {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   13. Contact / Consultation Form — Netlify Forms Integration
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameField    = document.getElementById('contactName');
    const emailField   = document.getElementById('contactEmail');
    const messageField = document.getElementById('contactMessage');
    const submitBtn    = document.getElementById('submitContactBtn');

    // --- Basic Validation ---
    if (!nameField.value.trim()) {
      showToast('Please enter your full name.', 'error');
      nameField.focus();
      return;
    }
    if (!emailField.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      showToast('Please enter a valid email address.', 'error');
      emailField.focus();
      return;
    }
    if (!messageField.value.trim()) {
      showToast('Please describe your project objectives.', 'error');
      messageField.focus();
      return;
    }

    // --- Loading State ---
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        style="animation: spin 1s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <span>Sending...</span>
    `;

    // --- Add spin keyframe if not present ---
    if (!document.getElementById('spinKeyframe')) {
      const style = document.createElement('style');
      style.id = 'spinKeyframe';
      style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // --- Collect selected services ---
    const services = [...form.querySelectorAll('input[name="services"]:checked')]
      .map(cb => cb.value).join(', ');

    // --- Build URL-encoded body (required by Netlify Forms) ---
    const params = new URLSearchParams();
    params.append('form-name', 'consultation-request');
    params.append('full-name',  nameField.value.trim());
    params.append('email',      emailField.value.trim());
    params.append('company',    document.getElementById('contactCompany')?.value.trim() || '');
    params.append('phone',      document.getElementById('contactPhone')?.value.trim() || '');
    params.append('services',   services || 'None selected');
    params.append('budget',     document.getElementById('contactBudget')?.value || '');
    params.append('message',    messageField.value.trim());

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (response.ok) {
        showToast("Thank you! We'll be in touch within 24 hours.", 'success');
        form.reset();
        // Restore default checked state for the first two service checkboxes
        form.querySelectorAll('input[name="services"]').forEach((cb, i) => {
          if (i < 2) cb.checked = true;
        });
      } else {
        throw new Error(`Netlify responded with status ${response.status}`);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      showToast('Submission failed. Please email us directly at info@powersoftsolution.com', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
}
