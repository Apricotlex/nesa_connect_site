// ========================================
// ROLE-BASED ACCESS CONTROL SYSTEM V2
// File: js/role-based-system.js
// Author: Nesa Connect Team
// Description: Complete authentication & authorization system
// ========================================

'use strict';

// ========================================
// 1. ROLE DEFINITIONS & CONSTANTS
// ========================================
const ROLES = {
  GUEST: 0,
  USER: 1,
  ORGANIZER: 2,
  ADMIN: 3
};

const ROLE_NAMES = {
  [ROLES.GUEST]: 'Guest',
  [ROLES.USER]: 'User',
  [ROLES.ORGANIZER]: 'Organizer',
  [ROLES.ADMIN]: 'Admin'
};

const ROLE_ICONS = {
  [ROLES.GUEST]: '👤',
  [ROLES.USER]: '👤',
  [ROLES.ORGANIZER]: '🎪',
  [ROLES.ADMIN]: '👑'
};

// ========================================
// 2. MOCK USER DATABASE (For Testing)
// ========================================
const mockUsers = [
  { 
    id: 1,
    email: 'user@test.com', 
    password: '123456', 
    role: ROLES.USER, 
    name: 'Regular User',
    avatar: null
  },
  { 
    id: 2,
    email: 'organizer@test.com', 
    password: '123456', 
    role: ROLES.ORGANIZER, 
    name: 'Event Organizer',
    avatar: null
  },
  { 
    id: 3,
    email: 'admin@test.com', 
    password: '123456', 
    role: ROLES.ADMIN, 
    name: 'Admin Super',
    avatar: null
  }
];

// ========================================
// 3. AUTHENTICATION - LOGIN SYSTEM
// ========================================
function handleLogin(email, password) {
  // Validate input
  if (!email || !password) {
    showToast('error', 'Login Failed', 'Email and password are required!');
    return false;
  }

  // Find user in database
  const user = mockUsers.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  );
  
  if (!user) {
    showToast('error', 'Login Failed', 'Invalid email or password!');
    return false;
  }

  // Create user session
  const userSession = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roleName: ROLE_NAMES[user.role],
    loginTime: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Save to localStorage
  try {
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    showToast('success', 'Login Successful!', `Welcome back, ${user.name}!`);
    
    // Redirect based on role after short delay
    setTimeout(() => {
      redirectAfterLogin(user.role);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    showToast('error', 'Login Failed', 'Unable to save session. Please try again.');
    return false;
  }
}

// ========================================
// 4. REDIRECT AFTER LOGIN
// ========================================
function redirectAfterLogin(role) {
  switch(role) {
    case ROLES.ADMIN:
      window.location.href = 'index.html?view=admin';
      break;
    case ROLES.ORGANIZER:
      window.location.href = 'index.html?view=organizer';
      break;
    case ROLES.USER:
      window.location.href = 'index.html';
      break;
    default:
      window.location.href = 'index.html';
  }
}

// ========================================
// 5. GET CURRENT USER SESSION
// ========================================
function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('currentUser');
    
    if (!userStr) {
      return null;
    }
    
    const user = JSON.parse(userStr);
    
    // Check if session expired
    if (user.expiresAt && Date.now() > user.expiresAt) {
      logout();
      showToast('warning', 'Session Expired', 'Please login again.');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// ========================================
// 6. CHECK IF USER IS LOGGED IN
// ========================================
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// ========================================
// 7. PERMISSION CHECKING FUNCTIONS
// ========================================
function hasPermission(requiredRole) {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role >= requiredRole;
}

function canCreateEvent() {
  return hasPermission(ROLES.ORGANIZER);
}

function canEditEvent(eventOwnerId) {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin can edit all events
  if (user.role === ROLES.ADMIN) return true;
  
  // Organizer can edit only their own events
  if (user.role === ROLES.ORGANIZER && user.email === eventOwnerId) return true;
  
  return false;
}

function canDeleteEvent(eventOwnerId) {
  return canEditEvent(eventOwnerId);
}

function canApproveEvent() {
  return hasPermission(ROLES.ADMIN);
}

function canManageUsers() {
  return hasPermission(ROLES.ADMIN);
}

function canViewAnalytics() {
  return hasPermission(ROLES.ORGANIZER);
}

// ========================================
// 8. UI ADJUSTMENT BASED ON ROLE
// ========================================
function adjustUIForRole() {
  const user = getCurrentUser();
  
  if (!user) {
    showGuestUI();
    return;
  }
  
  // Update navbar with user info
  updateNavbar(user);
  
  // Show role-specific UI elements
  switch(user.role) {
    case ROLES.ADMIN:
      showAdminUI();
      break;
    case ROLES.ORGANIZER:
      showOrganizerUI();
      break;
    case ROLES.USER:
      showUserUI();
      break;
    default:
      showGuestUI();
  }
  
  console.log(`UI adjusted for: ${user.name} (${ROLE_NAMES[user.role]})`);
}

// ========================================
// 9. UPDATE NAVBAR FOR LOGGED IN USER
// ========================================
function updateNavbar(user) {
  const loginBtn = document.querySelector('a[href="login.html"]');
  const userAvatar = document.querySelector('.user-avatar');
  
  // Hide login button
  if (loginBtn) {
    loginBtn.style.display = 'none';
  }
  
  // Show and update user avatar (paling kanan)
  if (userAvatar) {
    userAvatar.style.display = 'flex';
    userAvatar.style.order = '5'; // Pastikan paling kanan
    userAvatar.style.marginLeft = '8px';
    
    // Update avatar initial
    const avatarElement = userAvatar.querySelector('.avatar');
    if (avatarElement) {
      avatarElement.textContent = user.name[0].toUpperCase();
      avatarElement.title = user.name;
    }
    
    // Update dropdown menu based on role
    updateUserDropdown(user, userAvatar);
  }
}

// ========================================
// 10. UPDATE USER DROPDOWN MENU
// ========================================
function updateUserDropdown(user, userAvatar) {
  const dropdown = userAvatar.querySelector('.user-dropdown');
  if (!dropdown) return;
  
  const roleIcon = ROLE_ICONS[user.role];
  const roleName = ROLE_NAMES[user.role];
  
  let menuHTML = `
    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--light);">
      <div style="font-weight: 600; font-size: 14px;">${user.name}</div>
      <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
        ${roleIcon} ${roleName}
      </div>
    </div>
    <a href="#profile">👤 Profile</a>
    <a href="#tickets">🎫 My Tickets</a>
  `;
  
  // Add organizer-specific menu items
  if (user.role >= ROLES.ORGANIZER) {
    menuHTML += `
      <a href="#my-events">📋 My Events</a>
      <a href="create.html">➕ Create Event</a>
      <a href="#analytics">📊 Analytics</a>
    `;
  }
  
  // Add admin-specific menu items
  if (user.role === ROLES.ADMIN) {
    menuHTML += `
      <div style="border-top: 1px solid var(--border); margin: 4px 0;"></div>
      <a href="#admin" style="color: var(--primary);">⚙️ Admin Panel</a>
      <a href="#users" style="color: var(--primary);">👥 Manage Users</a>
      <a href="#approvals" style="color: var(--primary);">✅ Approvals</a>
    `;
  }
  
  // Add common bottom items
  menuHTML += `
    <div style="border-top: 1px solid var(--border); margin: 4px 0;"></div>
    <a href="#settings">⚙️ Settings</a>
    <a href="#" onclick="logout(); return false;" style="color: var(--danger);">🚪 Logout</a>
  `;
  
  dropdown.innerHTML = menuHTML;
}

// ========================================
// 11. SHOW GUEST UI (NOT LOGGED IN)
// ========================================
function showGuestUI() {
  const loginBtn = document.querySelector('a[href="login.html"]');
  const userAvatar = document.querySelector('.user-avatar');
  
  // Show login button
  if (loginBtn) {
    loginBtn.style.display = 'inline-flex';
  }
  
  // Hide user avatar
  if (userAvatar) {
    userAvatar.style.display = 'none';
  }
  
  // Hide features that require login
  hideElements([
    '.fab',
    '.wishlist-btn',
    '.rsvp-buttons',
    '.comment-form'
  ]);
  
  // Add login prompt to action buttons
  addLoginPrompts();
}

// ========================================
// 12. SHOW USER UI (BASIC USER)
// ========================================
function showUserUI() {
  const loginBtn = document.querySelector('a[href="login.html"]');
  const userAvatar = document.querySelector('.user-avatar');
  
  // Hide login button
  if (loginBtn) {
    loginBtn.style.display = 'none';
  }
  
  // Show user avatar
  if (userAvatar) {
    userAvatar.style.display = 'flex';
  }
  
  // FORCE REMOVE CTA BANNER FROM DOM
  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner) {
    ctaBanner.remove();
    console.log('✅ CTA Banner REMOVED from DOM');
  }
  
  // FORCE REMOVE FAB BUTTON
  const fabBtn = document.querySelector('.fab');
  if (fabBtn) {
    fabBtn.remove();
    console.log('✅ FAB Button REMOVED from DOM');
  }
  
  // Hide create event button and CTA banner (users can't create events)
  hideElements([
    '.fab',
    '.cta-banner'
  ]);
  
  // Show user features
  showElements([
    '.wishlist-btn',
    '.rsvp-buttons',
    '.comment-form'
  ]);
  
  // Hide edit buttons on all event cards
  document.querySelectorAll('.edit-event-btn, .delete-event-btn, .admin-action-buttons').forEach(btn => {
    btn.style.display = 'none';
  });
  
  // Remove "Create Event" link from dropdown if exists
  const createEventLinks = document.querySelectorAll('.user-dropdown a[href="create.html"], a[href="create.html"]');
  createEventLinks.forEach(link => {
    // Only remove if it's in dropdown or navigation, not in CTA banner (already removed)
    if (link.closest('.user-dropdown') || link.closest('.nav-menu')) {
      link.style.display = 'none';
    }
  });
  
  console.log('✅ User UI adjusted - All create event elements hidden/removed');
}

// ========================================
// 13. SHOW ORGANIZER UI
// ========================================
function showOrganizerUI() {
  const loginBtn = document.querySelector('a[href="login.html"]');
  const userAvatar = document.querySelector('.user-avatar');
  
  // Hide login button
  if (loginBtn) {
    loginBtn.style.display = 'none';
  }
  
  // Show user avatar
  if (userAvatar) {
    userAvatar.style.display = 'flex';
  }
  
  // Show create event button
  showElements([
    '.fab',
    '.wishlist-btn',
    '.rsvp-buttons',
    '.comment-form'
  ]);
  
  // Add edit/delete buttons to organizer's own events
  addEditButtonsToOwnEvents();
}

// ========================================
// 14. SHOW ADMIN UI (FULL ACCESS)
// ========================================
function showAdminUI() {
  const loginBtn = document.querySelector('a[href="login.html"]');
  const userAvatar = document.querySelector('.user-avatar');
  
  // Hide login button
  if (loginBtn) {
    loginBtn.style.display = 'none';
  }
  
  // Show user avatar
  if (userAvatar) {
    userAvatar.style.display = 'flex';
  }
  
  // Show all features
  showElements([
    '.fab',
    '.wishlist-btn',
    '.rsvp-buttons',
    '.comment-form'
  ]);
  
  // Add edit/delete buttons to ALL events
  addEditButtonsToAllEvents();
  
  // Add admin-specific controls
  addAdminControls();
  
  // Show pending approvals notification
  showPendingApprovals();
}

// ========================================
// 15. HELPER: HIDE ELEMENTS
// ========================================
function hideElements(selectors) {
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });
}

// ========================================
// 16. HELPER: SHOW ELEMENTS
// ========================================
function showElements(selectors) {
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = '';
    });
  });
}

// ========================================
// 17. ADD LOGIN PROMPTS TO BUTTONS
// ========================================
function addLoginPrompts() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    const btnText = btn.textContent.toLowerCase();
    if (btnText.includes('daftar') || btnText.includes('beli') || btnText.includes('register')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('warning', 'Login Required', 'Please login to continue');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
      });
    }
  });
}

// ========================================
// 18. ADD EDIT BUTTONS TO OWN EVENTS
// ========================================
function addEditButtonsToOwnEvents() {
  const user = getCurrentUser();
  if (!user) return;
  
  document.querySelectorAll('.event-card').forEach(card => {
    const ownerId = card.dataset.ownerId;
    
    // Only add buttons to organizer's own events
    if (ownerId === user.email) {
      addEventActionButtons(card);
    }
  });
}

// ========================================
// 19. ADD EDIT BUTTONS TO ALL EVENTS (ADMIN)
// ========================================
function addEditButtonsToAllEvents() {
  document.querySelectorAll('.event-card').forEach(card => {
    addEventActionButtons(card);
  });
}

// ========================================
// 20. ADD ACTION BUTTONS TO EVENT CARD
// ========================================
function addEventActionButtons(card) {
  const footer = card.querySelector('.event-footer');
  if (!footer) return;
  
  // Check if buttons already exist
  if (card.querySelector('.admin-action-buttons')) return;
  
  const eventId = card.dataset.eventId || 'unknown';
  
  const actionButtons = document.createElement('div');
  actionButtons.className = 'admin-action-buttons';
  actionButtons.style.cssText = 'display: flex; gap: 8px; margin-left: 8px;';
  actionButtons.innerHTML = `
    <button class="btn btn-outline btn-small edit-event-btn" 
            onclick="editEvent('${eventId}')" 
            title="Edit Event">
      ✏️
    </button>
    <button class="btn btn-outline btn-small delete-event-btn" 
            onclick="deleteEvent('${eventId}')" 
            title="Delete Event"
            style="color: var(--danger);">
      🗑️
    </button>
  `;
  
  footer.appendChild(actionButtons);
}

// ========================================
// 21. ADD ADMIN CONTROLS TO PENDING EVENTS
// ========================================
function addAdminControls() {
  document.querySelectorAll('.event-card[data-status="pending"]').forEach(card => {
    const footer = card.querySelector('.event-footer');
    if (!footer) return;
    
    // Check if controls already exist
    if (card.querySelector('.admin-approval-controls')) return;
    
    const eventId = card.dataset.eventId || 'unknown';
    
    const adminControls = document.createElement('div');
    adminControls.className = 'admin-approval-controls';
    adminControls.style.cssText = `
      display: flex; 
      gap: 8px; 
      margin-top: 12px; 
      padding-top: 12px; 
      border-top: 2px solid var(--warning);
    `;
    adminControls.innerHTML = `
      <button class="btn btn-small" 
              style="flex: 1; background: #10B981; color: white;" 
              onclick="approveEvent('${eventId}')">
        ✓ Approve
      </button>
      <button class="btn btn-small" 
              style="flex: 1; background: #EF4444; color: white;" 
              onclick="rejectEvent('${eventId}')">
        ✗ Reject
      </button>
    `;
    
    footer.appendChild(adminControls);
  });
}

// ========================================
// 22. SHOW PENDING APPROVALS NOTIFICATION
// ========================================
function showPendingApprovals() {
  const notificationBell = document.querySelector('.notification-bell');
  if (!notificationBell) return;
  
  const badge = notificationBell.querySelector('.notification-badge');
  if (!badge) return;
  
  const pendingCount = document.querySelectorAll('.event-card[data-status="pending"]').length;
  
  if (pendingCount > 0) {
    badge.textContent = pendingCount;
    badge.style.background = '#F59E0B';
    badge.style.display = 'flex';
  }
}

// ========================================
// 23. EVENT MANAGEMENT FUNCTIONS
// ========================================
window.editEvent = function(eventId) {
  showToast('info', 'Editing Event', `Opening editor for event ${eventId}`);
  setTimeout(() => {
    window.location.href = `create.html?id=${eventId}&mode=edit`;
  }, 500);
};

window.deleteEvent = function(eventId) {
  const confirmed = confirm('Are you sure you want to delete this event?');
  if (confirmed) {
    showToast('success', 'Event Deleted', `Event ${eventId} has been deleted`);
    // TODO: Call API to delete event
  }
};

window.approveEvent = function(eventId) {
  showToast('success', 'Event Approved', `Event ${eventId} is now published!`);
  // TODO: Call API to approve event
  
  // Remove pending status
  const card = document.querySelector(`.event-card[data-event-id="${eventId}"]`);
  if (card) {
    card.removeAttribute('data-status');
    const controls = card.querySelector('.admin-approval-controls');
    if (controls) controls.remove();
  }
};

window.rejectEvent = function(eventId) {
  const reason = prompt('Reason for rejection:');
  if (reason) {
    showToast('info', 'Event Rejected', `Event ${eventId} has been rejected`);
    // TODO: Call API to reject event with reason
    
    // Remove the event card
    const card = document.querySelector(`.event-card[data-event-id="${eventId}"]`);
    if (card) {
      card.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => card.remove(), 300);
    }
  }
};

window.featureEvent = function(eventId) {
  showToast('success', 'Featured!', 'Event is now featured on homepage');
  // TODO: Call API to feature event
};

// ========================================
// 24. LOGOUT FUNCTION
// ========================================
window.logout = function() {
  const user = getCurrentUser();
  
  if (user) {
    localStorage.removeItem('currentUser');
    showToast('success', 'Logged Out', `Goodbye, ${user.name}!`);
  } else {
    showToast('info', 'Already Logged Out', 'You are not logged in');
  }
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
};

// ========================================
// 25. PAGE PROTECTION
// ========================================
function protectPage(requiredRole) {
  if (!hasPermission(requiredRole)) {
    const roleName = ROLE_NAMES[requiredRole];
    showToast('error', 'Access Denied', `This page requires ${roleName} role`);
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
    return false;
  }
  return true;
}

// Example usage in create.html:
// protectPage(ROLES.ORGANIZER);

// ========================================
// 26. INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Adjust UI based on current user role
  adjustUIForRole();
  
  // Handle login form submission
  if (window.location.pathname.includes('login.html')) {
    initializeLoginPage();
  }
  
  // Handle signup form submission
  if (window.location.pathname.includes('signup.html')) {
    initializeSignupPage();
  }
  
  // Add quick login buttons for testing (only on login page)
  if (window.location.pathname.includes('login.html')) {
    addQuickLoginButtons();
  }
});

// ========================================
// 27. INITIALIZE LOGIN PAGE
// ========================================
function initializeLoginPage() {
  const loginForm = document.querySelector('.auth-card form');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = document.querySelector('input[type="text"], input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    handleLogin(email, password);
  });
}

// ========================================
// 28. INITIALIZE SIGNUP PAGE
// ========================================
function initializeSignupPage() {
  const signupForm = document.querySelector('.auth-card form');
  if (!signupForm) return;
  
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // TODO: Implement signup logic
    showToast('info', 'Coming Soon', 'Signup feature will be available soon!');
  });
}

// ========================================
// 29. QUICK LOGIN BUTTONS (FOR TESTING)
// ========================================
function addQuickLoginButtons() {
  const authCard = document.querySelector('.auth-card');
  if (!authCard) return;
  
  const quickLoginHTML = `
    <div style="margin-top: 20px; padding: 16px; background: var(--light); border-radius: 12px;">
      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; text-align: center; font-weight: 600;">
        🧪 Quick Login (Testing Only)
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button type="button" class="btn btn-outline btn-small" onclick="quickLogin('user')">
          👤 Login as User
        </button>
        <button type="button" class="btn btn-outline btn-small" onclick="quickLogin('organizer')">
          🎪 Login as Organizer
        </button>
        <button type="button" class="btn btn-outline btn-small" onclick="quickLogin('admin')">
          👑 Login as Admin
        </button>
      </div>
      <div style="font-size: 11px; color: var(--text-secondary); margin-top: 8px; text-align: center;">
        All passwords: <code>123456</code>
      </div>
    </div>
  `;
  
  authCard.insertAdjacentHTML('beforeend', quickLoginHTML);
}

// ========================================
// 30. QUICK LOGIN HELPER
// ========================================
window.quickLogin = function(role) {
  const credentials = {
    user: { email: 'user@test.com', password: '123456' },
    organizer: { email: 'organizer@test.com', password: '123456' },
    admin: { email: 'admin@test.com', password: '123456' }
  };
  
  const cred = credentials[role];
  if (!cred) return;
  
  const emailInput = document.querySelector('input[type="text"], input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  
  if (emailInput && passwordInput) {
    emailInput.value = cred.email;
    passwordInput.value = cred.password;
    
    showToast('info', 'Auto-filled', `Credentials for ${role} filled. Click Login!`);
  }
};

// ========================================
// 31. CONSOLE MESSAGES
// ========================================
console.log('%c🔐 Role-Based System Loaded', 'color: #10B981; font-size: 16px; font-weight: bold;');
console.log('%c📋 Test Accounts:', 'color: #3B82F6; font-size: 14px; font-weight: bold;');
console.log('%c👤 User: user@test.com | 123456', 'color: #64748B; font-size: 12px;');
console.log('%c🎪 Organizer: organizer@test.com | 123456', 'color: #64748B; font-size: 12px;');
console.log('%c👑 Admin: admin@test.com | 123456', 'color: #64748B; font-size: 12px;');

// ========================================
// 32. EXPORT FUNCTIONS (IF NEEDED)
// ========================================
window.RoleSystem = {
  ROLES,
  getCurrentUser,
  isLoggedIn,
  hasPermission,
  canCreateEvent,
  canEditEvent,
  canDeleteEvent,
  canApproveEvent,
  canManageUsers,
  canViewAnalytics,
  logout,
  protectPage
};

// ========================================
// END OF ROLE-BASED SYSTEM V2
// ========================================