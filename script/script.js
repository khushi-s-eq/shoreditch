document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const toggleButton = document.querySelector('.header__toggle');
  const backdrop = document.getElementById('mobileBackdrop');
  const mobileNav = document.getElementById('mobileNav');
  const body = document.body;

  // ===== Desktop Mega Menu Functionality =====
  const menuParents = document.querySelectorAll('.mega-menu-parent');

  menuParents.forEach((parent) => {
    const megaMenu = parent.querySelector('.mega-menu');
    const servicesContent = megaMenu?.querySelector('.services-content');
    const industriesContent = megaMenu?.querySelector('.industries-content');
    const navLinks = megaMenu?.querySelectorAll('.mega-menu__nav-link[data-menu]');
    const parentLink = parent.querySelector('.header__link');
    const isServicesParent = parentLink?.textContent.trim().includes('Our services');
    const isIndustriesParent = parentLink?.textContent.trim().includes('Industries');

    function switchMenuContent(menuType) {
      if (!megaMenu) return;
      
      if (servicesContent) servicesContent.style.display = 'none';
      if (industriesContent) industriesContent.style.display = 'none';
      if (navLinks) navLinks.forEach(link => link.classList.remove('active'));

      if (menuType === 'services' && servicesContent) {
        servicesContent.style.display = 'grid';
        megaMenu.querySelector('[data-menu="services"]')?.classList.add('active');
      } else if (menuType === 'industries' && industriesContent) {
        industriesContent.style.display = 'grid';
        megaMenu.querySelector('[data-menu="industries"]')?.classList.add('active');
      }
    }

    if (parent && megaMenu) {
      parent.addEventListener('mouseenter', function() {
        if (isServicesParent) {
          switchMenuContent('services');
        } else if (isIndustriesParent) {
          switchMenuContent('industries');
        }
      });

      if (navLinks) {
        navLinks.forEach(navLink => {
          navLink.addEventListener('click', function(e) {
            e.preventDefault();
            const menuType = this.getAttribute('data-menu');
            switchMenuContent(menuType);
          });

          navLink.addEventListener('mouseenter', function() {
            const menuType = this.getAttribute('data-menu');
            switchMenuContent(menuType);
          });
        });
      }
    }
  });

  // ===== Mobile Menu Functionality =====
  function closeMobileMenu() {
    mobileNav.classList.remove('show');
    backdrop.classList.remove('show');
    toggleButton.classList.remove('active');
    header.classList.remove('mobile-menu-open');
    body.style.overflow = '';
    body.style.position = '';
  }

  function openMobileMenu() {
    mobileNav.classList.add('show');
    backdrop.classList.add('show');
    toggleButton.classList.add('active');
    header.classList.add('mobile-menu-open');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
  }

  // Toggle mobile menu
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      if (mobileNav.classList.contains('show')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close menu when clicking backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeMobileMenu);
  }

  // ===== Mobile Dropdown Functionality =====
  const mobileDropdownToggles = document.querySelectorAll('.mobile__dropdown-toggle');
  
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const parent = this.closest('.mobile__dropdown-parent');
      const menu = parent?.querySelector('.mobile__dropdown-menu');
      if (!menu) return;
      
      const isOpen = menu.classList.contains('show');
      
      // Close all other dropdowns first
      document.querySelectorAll('.mobile__dropdown-menu').forEach(m => {
        if (m !== menu) {
          m.classList.remove('show');
          const otherParent = m.closest('.mobile__dropdown-parent');
          if (otherParent) otherParent.classList.remove('show-dropdown');
        }
      });
      
      // Toggle current dropdown
      if (isOpen) {
        menu.classList.remove('show');
        parent.classList.remove('show-dropdown');
      } else {
        menu.classList.add('show');
        parent.classList.add('show-dropdown');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mobile__dropdown-parent')) {
      document.querySelectorAll('.mobile__dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
        const parent = menu.closest('.mobile__dropdown-parent');
        if (parent) parent.classList.remove('show-dropdown');
      });
    }
  });

  // Close menu when clicking on a link (except dropdown toggles)
  document.querySelectorAll('.mobile__nav a').forEach(link => {
    if (!link.classList.contains('mobile__dropdown-toggle') && !link.closest('.mobile__dropdown-item-wrapper')) {
      link.addEventListener('click', closeMobileMenu);
    }
  });

  // ===== Window Resize Handler =====
  function handleResize() {
    if (window.innerWidth >= 992) {
      closeMobileMenu();
      
      // Reset all mobile dropdowns
      document.querySelectorAll('.mobile__dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
        const parent = menu.closest('.mobile__dropdown-parent');
        if (parent) parent.classList.remove('show-dropdown');
      });
    }
  }

  window.addEventListener('resize', handleResize);

  // ===== Scroll Handler for Header =====
  let lastScrollPosition = 0;
  const scrollThreshold = 100;

  function handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    
    if (currentScrollPosition <= 0) {
      // At top of page
      header.classList.remove('header--hidden');
      header.classList.remove('header--scrolled');
    } else if (currentScrollPosition > lastScrollPosition && currentScrollPosition > scrollThreshold) {
      // Scrolling down
      header.classList.add('header--hidden');
      header.classList.add('header--scrolled');
    } else {
      // Scrolling up
      header.classList.remove('header--hidden');
      if (currentScrollPosition > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }
    
    lastScrollPosition = currentScrollPosition;
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initialize state

  // Initialize AOS animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 600,
      easing: "ease-in-out",
    });
  }
});