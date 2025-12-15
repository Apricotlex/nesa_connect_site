
// ========================================
// 28. QUICK VIEW MODAL
// ========================================
function createQuickViewModal() {
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.innerHTML = `
    <div class="quick-view-content">
      <button class="quick-view-close">×</button>
      <div id="quick-view-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
  
  modal.querySelector('.quick-view-close').addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  return modal;
}

const quickViewModal = createQuickViewModal();

// Add quick view button to event footer (not overlapping)
document.querySelectorAll('.event-card').forEach(card => {
  const footer = card.querySelector('.event-footer');
  if (!footer) return;
  
  const quickViewBtn = document.createElement('button');
  quickViewBtn.className = 'btn btn-outline btn-small';
  quickViewBtn.textContent = '👁️ Preview';
  quickViewBtn.style.cssText = 'margin-left: auto;';
  
  quickViewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const title = card.querySelector('h3')?.textContent || 'Event';
    const description = card.querySelector('p')?.textContent || 'No description';
    const price = card.querySelector('.event-price')?.textContent || 'Free';
    const meta = card.querySelector('.event-meta')?.innerHTML || '';
    
    document.getElementById('quick-view-body').innerHTML = `
      <div style="padding: 32px;">
        <h2 style="margin-bottom: 16px;">${title}</h2>
        <div style="margin-bottom: 20px; color: var(--text-secondary); font-size: 14px;">${meta}</div>
        <p style="color: var(--text-secondary); margin: 16px 0; line-height: 1.7;">${description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--light); border-radius: 16px; margin: 24px 0;">
          <span style="font-size: 14px; color: var(--text-secondary);">Harga Tiket</span>
          <span style="font-size: 28px; font-weight: 700; color: var(--primary);">${price}</span>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-outline btn-large" style="flex: 1;" onclick="quickViewModal.classList.remove('active')">Tutup</button>
          <a href="detail.html" class="btn btn-primary btn-large" style="flex: 2;">Lihat Detail Lengkap</a>
        </div>
      </div>
    `;
    
    quickViewModal.classList.add('active');
    showToast('info', 'Quick Preview', 'Lihat preview event');
  });
  
  // Add to footer instead of absolute position
  footer.appendChild(quickViewBtn);
});

// ========================================
// 29. SKELETON LOADING
// ========================================
function showSkeletonLoading() {
  const eventsGrid = document.querySelector('.events-grid');
  if (!eventsGrid) return;
  
  const skeleton = `
    <div class="skeleton-card">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
    </div>
  `.repeat(6);
  
  eventsGrid.innerHTML = skeleton;
  
  setTimeout(() => {
    // Load actual content
    showToast('success', 'Loaded', 'Events loaded successfully!');
  }, 1500);
}

// ========================================
// 30. INFINITE SCROLL
// ========================================
let page = 1;
let loading = false;

function loadMoreEvents() {
  if (loading) return;
  loading = true;
  
  showToast('info', 'Loading', 'Loading more events...');
  
  setTimeout(() => {
    page++;
    showToast('success', 'Loaded', `Page ${page} loaded!`);
    loading = false;
  }, 1000);
}

window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
    loadMoreEvents();
  }
});

// ========================================
// 31. PROGRESS BAR (Ticket Quota)
// ========================================
document.querySelectorAll('.event-card').forEach(card => {
  const sold = Math.floor(Math.random() * 80) + 20;
  const total = 100;
  const percentage = (sold / total) * 100;
  
  const progressHTML = `
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="progress-label">
        <span>${sold}/${total} sold</span>
        <span>${100 - sold} left</span>
      </div>
    </div>
  `;
  
  const footer = card.querySelector('.event-footer');
  if (footer) {
    footer.insertAdjacentHTML('beforebegin', progressHTML);
  }
});

// ========================================
// 32. IMAGE LIGHTBOX
// ========================================
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<button class="lightbox-close">×</button><img src="" alt="">';
document.body.appendChild(lightbox);

document.querySelectorAll('.event-image, .detail-image').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lightbox.querySelector('img').src = img.style.backgroundImage || 'placeholder';
    lightbox.classList.add('active');
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

// ========================================
// 33. BREADCRUMBS
// ========================================
function addBreadcrumbs() {
  const path = window.location.pathname;
  const pages = {
    '/index.html': 'Home',
    '/detail.html': 'Event Detail',
    '/checkout.html': 'Checkout',
    '/create.html': 'Create Event',
    '/login.html': 'Login',
    '/signup.html': 'Sign Up'
  };
  
  const breadcrumbsHTML = `
    <nav class="breadcrumbs">
      <div class="breadcrumb-item">
        <a href="index.html">🏠 Home</a>
      </div>
      <span class="breadcrumb-separator">›</span>
      <div class="breadcrumb-item active">
        ${pages[path] || 'Page'}
      </div>
    </nav>
  `;
  
  const container = document.querySelector('.container');
  if (container && !path.includes('index')) {
    container.insertAdjacentHTML('afterbegin', breadcrumbsHTML);
  }
}

addBreadcrumbs();

// ========================================
// 34. RATING STARS
// ========================================
function addRatingStars() {
  const detailMain = document.querySelector('.detail-main');
  if (!detailMain) return;
  
  const rating = 4.5;
  const reviews = 127;
  
  const stars = Array.from({length: 5}, (_, i) => {
    return `<span class="star ${i < Math.floor(rating) ? 'filled' : ''}">⭐</span>`;
  }).join('');
  
  const ratingHTML = `
    <div class="rating-summary">
      <div class="rating-number">${rating}</div>
      <div class="rating-info">
        <div class="rating-stars">${stars}</div>
        <div class="rating-count">${reviews} reviews</div>
      </div>
    </div>
  `;
  
  const h2 = detailMain.querySelector('h2');
  if (h2) {
    h2.insertAdjacentHTML('afterend', ratingHTML);
  }
}

addRatingStars();

// ========================================
// 35. COMMENTS SECTION
// ========================================
function addCommentsSection() {
  const detailMain = document.querySelector('.detail-main');
  if (!detailMain) return;
  
  const comments = [
    { name: 'Budi', text: 'Event keren banget! Pasti datang!', time: '2 jam lalu' },
    { name: 'Siti', text: 'Ada diskon ga nih? 😊', time: '5 jam lalu' },
    { name: 'Andi', text: 'Lokasi mudah dijangkau ga?', time: '1 hari lalu' }
  ];
  
  const commentsHTML = `
    <div class="comments-section">
      <h3>💬 Komentar (${comments.length})</h3>
      
      <div class="comment-form">
        <textarea class="comment-input" placeholder="Tulis komentar..."></textarea>
        <button class="btn btn-primary" style="margin-top: 12px;" onclick="postComment()">Kirim Komentar</button>
      </div>
      
      <div id="comments-list">
        ${comments.map(c => `
          <div class="comment-item">
            <div class="comment-avatar">${c.name[0]}</div>
            <div class="comment-content">
              <div class="comment-author">${c.name}</div>
              <div class="comment-time">${c.time}</div>
              <div class="comment-text">${c.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  detailMain.insertAdjacentHTML('beforeend', commentsHTML);
}

addCommentsSection();

window.postComment = function() {
  const input = document.querySelector('.comment-input');
  const text = input.value.trim();
  
  if (!text) {
    showToast('warning', 'Empty Comment', 'Please write something!');
    return;
  }
  
  const newComment = `
    <div class="comment-item">
      <div class="comment-avatar">U</div>
      <div class="comment-content">
        <div class="comment-author">You</div>
        <div class="comment-time">Just now</div>
        <div class="comment-text">${text}</div>
      </div>
    </div>
  `;
  
  document.getElementById('comments-list').insertAdjacentHTML('afterbegin', newComment);
  input.value = '';
  showToast('success', 'Posted!', 'Comment posted successfully');
};

// ========================================
// 36. GOING/INTERESTED BUTTONS
// ========================================
function addRSVPButtons() {
  const detailSidebar = document.querySelector('.detail-sidebar');
  if (!detailSidebar) return;
  
  const rsvpHTML = `
    <div class="rsvp-buttons">
      <button class="rsvp-btn" data-type="going">
        ✓ Going
        <span class="rsvp-count">(234)</span>
      </button>
      <button class="rsvp-btn" data-type="interested">
        ★ Interested
        <span class="rsvp-count">(89)</span>
      </button>
    </div>
  `;
  
  const priceCard = detailSidebar.querySelector('.price-card');
  if (priceCard) {
    priceCard.insertAdjacentHTML('afterend', rsvpHTML);
  }
  
  document.querySelectorAll('.rsvp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const wasActive = this.classList.contains('active');
      document.querySelectorAll('.rsvp-btn').forEach(b => b.classList.remove('active'));
      
      if (!wasActive) {
        this.classList.add('active');
        const type = this.dataset.type === 'going' ? 'Going' : 'Interested';
        showToast('success', type, `You're ${type.toLowerCase()} in this event!`);
      }
    });
  });
}

addRSVPButtons();

// ========================================
// 37. SHARE COUNT
// ========================================
document.querySelectorAll('.event-card').forEach(card => {
  const shareCount = Math.floor(Math.random() * 50) + 5;
  const meta = card.querySelector('.event-meta');
  if (meta) {
    meta.insertAdjacentHTML('beforeend', `<span class="share-count">📤 ${shareCount} shares</span>`);
  }
});

// ========================================
// 38. FRIEND ACTIVITY
// ========================================
function addFriendActivity() {
  const detailSidebar = document.querySelector('.detail-sidebar');
  if (!detailSidebar) return;
  
  const friends = ['A', 'B', 'C'];
  const friendsHTML = `
    <div class="friend-activity">
      <div class="friend-avatars">
        ${friends.map(f => `<div class="friend-avatar">${f}</div>`).join('')}
      </div>
      <span>${friends.length} temanmu tertarik</span>
    </div>
  `;
  
  const h3 = detailSidebar.querySelector('h3');
  if (h3) {
    h3.insertAdjacentHTML('afterend', friendsHTML);
  }
}

addFriendActivity();

// ========================================
// 39. GAMIFICATION - POINTS SYSTEM
// ========================================
let userPoints = parseInt(localStorage.getItem('userPoints') || '0');

function addPoints(amount, reason) {
  userPoints += amount;
  localStorage.setItem('userPoints', userPoints.toString());
  showToast('success', `+${amount} Points!`, reason);
  updatePointsBadge();
}

function updatePointsBadge() {
  let badge = document.querySelector('.points-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'points-badge';
    document.querySelector('.nav-actions')?.insertBefore(badge, document.querySelector('.chip'));
  }
  badge.innerHTML = `🏆 ${userPoints} pts`;
}

updatePointsBadge();

// Add points on actions
document.querySelectorAll('.btn-primary').forEach(btn => {
  if (btn.textContent.includes('Daftar') || btn.textContent.includes('Beli')) {
    btn.addEventListener('click', () => {
      addPoints(10, 'Registered for event!');
    });
  }
});

// ========================================
// 40. ACHIEVEMENT BADGES
// ========================================
const achievements = [
  { id: 'first_event', name: 'First Event', description: 'Registered for your first event', icon: '🎉' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Shared 5 events', icon: '🦋' },
  { id: 'event_master', name: 'Event Master', description: 'Attended 10 events', icon: '👑' }
];

function checkAchievements() {
  const unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  
  if (userPoints >= 10 && !unlockedAchievements.includes('first_event')) {
    unlockAchievement('first_event');
  }
}

function unlockAchievement(id) {
  const achievement = achievements.find(a => a.id === id);
  if (!achievement) return;
  
  const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
  unlocked.push(id);
  localStorage.setItem('achievements', JSON.stringify(unlocked));
  
  showToast('success', `${achievement.icon} Achievement Unlocked!`, achievement.name);
}

setInterval(checkAchievements, 5000);

// ========================================
// 41. LEADERBOARD
// ========================================
const leaderboardData = [
  { name: 'Budi', points: 250, rank: 1 },
  { name: 'Siti', points: 180, rank: 2 },
  { name: 'Andi', points: 150, rank: 3 },
  { name: 'You', points: userPoints, rank: 15 }
];

function showLeaderboard() {
  const leaderboardHTML = `
    <div class="leaderboard">
      <h4 style="margin-bottom: 16px;">🏆 Top Users</h4>
      ${leaderboardData.map(user => `
        <div class="leaderboard-item">
          <div class="leaderboard-rank top-${user.rank <= 3 ? user.rank : ''}">${user.rank}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600;">${user.name}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${user.points} points</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // Can be added to a modal or sidebar
  console.log('Leaderboard ready!');
}

// ========================================
// 42. REFERRAL SYSTEM
// ========================================
const referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();
localStorage.setItem('referralCode', referralCode);

function addReferralCard() {
  const detailSidebar = document.querySelector('.detail-sidebar');
  if (!detailSidebar) return;
  
  const referralHTML = `
    <div class="referral-card">
      <h4>🎁 Ajak Teman, Dapat Diskon!</h4>
      <p style="font-size: 14px; opacity: 0.9; margin: 8px 0;">Bagikan kode referral untuk diskon 20%</p>
      <div class="referral-code">${referralCode}</div>
      <button class="btn btn-white" style="width: 100%;" onclick="copyReferral()">📋 Copy Kode</button>
    </div>
  `;
  
  detailSidebar.insertAdjacentHTML('beforeend', referralHTML);
}

addReferralCard();

window.copyReferral = function() {
  navigator.clipboard.writeText(referralCode).then(() => {
    showToast('success', 'Copied!', 'Referral code copied to clipboard');
  });
};

// ========================================
// 43. STREAK COUNTER
// ========================================
let streak = parseInt(localStorage.getItem('eventStreak') || '0');
const lastEventDate = localStorage.getItem('lastEventDate');
const today = new Date().toDateString();

if (lastEventDate !== today) {
  streak++;
  localStorage.setItem('eventStreak', streak.toString());
  localStorage.setItem('lastEventDate', today);
  
  if (streak > 1) {
    showToast('success', `🔥 ${streak} Day Streak!`, 'Keep it up!');
  }
}

// ========================================
// 44. PARALLAX EFFECT
// ========================================
window.addEventListener('scroll', () => {
  const parallaxElements = document.querySelectorAll('.parallax-section');
  parallaxElements.forEach(el => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    el.style.setProperty('--parallax-offset', `${rate}px`);
  });
});

// ========================================
// 45. PAGE TRANSITIONS
// ========================================
const pageTransition = document.createElement('div');
pageTransition.className = 'page-transition';
pageTransition.innerHTML = '<div class="transition-logo">🎉</div>';
document.body.appendChild(pageTransition);

document.querySelectorAll('a').forEach(link => {
  if (link.hostname === window.location.hostname && !link.href.includes('#')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.href;
      
      pageTransition.classList.add('active');
      
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  }
});

// ========================================
// 46. WEATHER WIDGET
// ========================================
function addWeatherWidget() {
  const detailSidebar = document.querySelector('.detail-sidebar');
  if (!detailSidebar) return;
  
  // Simulated weather data
  const weather = {
    temp: 28,
    condition: 'Sunny',
    icon: '☀️'
  };
  
  const weatherHTML = `
    <div class="weather-widget">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="weather-icon">${weather.icon}</div>
          <div class="weather-temp">${weather.temp}°C</div>
          <div style="font-size: 14px; opacity: 0.9;">${weather.condition}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; opacity: 0.8;">Event Day Weather</div>
          <div style="font-size: 12px; opacity: 0.8;">Perfect for outdoor!</div>
        </div>
      </div>
    </div>
  `;
  
  const priceCard = detailSidebar.querySelector('.price-card');
  if (priceCard) {
    priceCard.insertAdjacentHTML('beforebegin', weatherHTML);
  }
}

addWeatherWidget();

// ========================================
// 47. MAP INTEGRATION
// ========================================
function addMapIntegration() {
  const detailMain = document.querySelector('.detail-main');
  if (!detailMain) return;
  
  const mapHTML = `
    <div class="map-container">
      <iframe 
        width="100%" 
        height="300" 
        frameborder="0" 
        style="border:0; border-radius: 14px;" 
        src="https://www.openstreetmap.org/export/embed.html?bbox=112.7177%2C-7.2575%2C112.7577%2C-7.2175&layer=mapnik" 
        allowfullscreen>
      </iframe>
    </div>
  `;
  
  const infoSection = detailMain.querySelector('.detail-info');
  if (infoSection) {
    infoSection.insertAdjacentHTML('afterend', mapHTML);
  }
}

addMapIntegration();

// ========================================
// 48. RELATED EVENTS
// ========================================
function addRelatedEvents() {
  const detailMain = document.querySelector('.detail-main');
  if (!detailMain) return;
  
  const relatedEvents = [
    { title: 'Workshop Design', date: '25 Sep', emoji: '🎨' },
    { title: 'Food Festival', date: '26 Sep', emoji: '🍔' },
    { title: 'Gaming Tournament', date: '27 Sep', emoji: '🎮' }
  ];
  
  const relatedHTML = `
    <div class="related-events">
      <h3>🔗 Event Serupa</h3>
      <div class="related-grid">
        ${relatedEvents.map(e => `
          <div class="related-card" onclick="window.location='detail.html'">
            <div class="related-image">${e.emoji}</div>
            <div class="related-info">
              <div class="related-title">${e.title}</div>
              <div class="related-date">${e.date}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  detailMain.insertAdjacentHTML('beforeend', relatedHTML);
}

addRelatedEvents();

// ========================================
// 49. RECENTLY VIEWED
// ========================================
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

function addToRecentlyViewed(eventId, eventTitle) {
  recentlyViewed = recentlyViewed.filter(e => e.id !== eventId);
  recentlyViewed.unshift({ id: eventId, title: eventTitle, date: Date.now() });
  recentlyViewed = recentlyViewed.slice(0, 5);
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

if (window.location.pathname.includes('detail')) {
  addToRecentlyViewed('event-123', 'Opening Night Live Band');
}

// ========================================
// 50. QR CODE GENERATOR
// ========================================
function addQRCode() {
  const checkoutCard = document.querySelector('.checkout-card');
  if (!checkoutCard || !window.location.pathname.includes('checkout')) return;
  
  const qrHTML = `
    <div class="qr-code-container">
      <h4>📱 Scan QR untuk Mobile Payment</h4>
      <div class="qr-code">QR</div>
      <p style="font-size: 12px; color: var(--text-secondary); margin-top: 12px;">
        Scan dengan aplikasi e-wallet
      </p>
    </div>
  `;
  
  const paymentSection = document.querySelector('.checkout-card:nth-of-type(4)');
  if (paymentSection) {
    paymentSection.insertAdjacentHTML('beforeend', qrHTML);
  }
}

addQRCode();

// ========================================
// 51. WAITLIST FEATURE
// ========================================
function checkWaitlist() {
  const ticketsSold = 234;
  const capacity = 500;
  
  if (ticketsSold >= capacity * 0.9) {
    const waitlistHTML = `
      <div class="waitlist-banner">
        <h4>⚠️ Almost Sold Out!</h4>
        <p>Join waitlist to get notified if tickets become available</p>
        <button class="btn btn-white" onclick="joinWaitlist()">Join Waitlist</button>
      </div>
    `;
    
    const sidebar = document.querySelector('.detail-sidebar');
    if (sidebar) {
      sidebar.insertAdjacentHTML('beforeend', waitlistHTML);
    }
  }
}

window.joinWaitlist = function() {
  showToast('success', 'Joined Waitlist', "We'll notify you if tickets become available!");
};

checkWaitlist();

// ========================================
// 52. CALENDAR INTEGRATION
// ========================================
function addToCalendar() {
  const sidebar = document.querySelector('.detail-sidebar');
  if (!sidebar) return;
  
  const calendarBtn = document.createElement('button');
  calendarBtn.className = 'btn btn-outline btn-large';
  calendarBtn.style.width = '100%';
  calendarBtn.style.marginTop = '12px';
  calendarBtn.innerHTML = '📅 Add to Calendar';
  
  calendarBtn.addEventListener('click', () => {
    const event = {
      title: 'Opening Night Live Band',
      start: '2025-09-19T13:00:00',
      end: '2025-09-19T20:00:00',
      location: 'Auditorium UNESA'
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/[-:]/g, '')}/${event.end.replace(/[-:]/g, '')}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    showToast('success', 'Opening Calendar', 'Redirecting to Google Calendar');
  });
  
  const buyBtn = sidebar.querySelector('.btn-primary');
  if (buyBtn) {
    buyBtn.insertAdjacentElement('afterend', calendarBtn);
  }
}

addToCalendar();

// ========================================
// 53. REMINDER SYSTEM
// ========================================
function setupReminders() {
  const sidebar = document.querySelector('.detail-sidebar');
  if (!sidebar) return;
  
  const reminderHTML = `
    <div style="margin-top: 20px; padding: 16px; background: var(--light); border-radius: 12px;">
      <h4 style="font-size: 14px; margin-bottom: 12px;">🔔 Set Reminder</h4>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
          <input type="checkbox" class="reminder-check" data-days="7">
          <span>7 days before</span>
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
          <input type="checkbox" class="reminder-check" data-days="1">
          <span>1 day before</span>
        </label>
      </div>
    </div>
  `;
  
  sidebar.insertAdjacentHTML('beforeend', reminderHTML);
  
  document.querySelectorAll('.reminder-check').forEach(check => {
    check.addEventListener('change', function() {
      const days = this.dataset.days;
      if (this.checked) {
        showToast('success', 'Reminder Set', `You'll be reminded ${days} days before the event`);
      }
    });
  });
}

setupReminders();

// ========================================
// 54. EVENT GALLERY
// ========================================
function addEventGallery() {
  const detailMain = document.querySelector('.detail-main');
  if (!detailMain) return;
  
  const galleryHTML = `
    <div style="margin-top: 32px;">
      <h3>📸 Event Gallery</h3>
      <div class="event-gallery">
        ${Array.from({length: 6}, (_, i) => `
          <div class="gallery-item" onclick="openLightbox()">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][i % 4]}, #6366F1); display: flex; align-items: center; justify-content: center; font-size: 32px;">
              📷
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  detailMain.insertAdjacentHTML('beforeend', galleryHTML);
}

addEventGallery();

window.openLightbox = function() {
  lightbox.classList.add('active');
};

// ========================================
// ALL FEATURES LOADED! 🎉
// ========================================
console.log('%c🎉 ALL 54 FEATURES LOADED!', 'color: #10B981; font-size: 20px; font-weight: bold;');
console.log('%c✨ Nesa Connect V2 - Ultimate Edition', 'color: #3B82F6; font-size: 16px;');

// ========================================
// 55. GROUP BOOKING DISCOUNT
// ========================================
function addGroupBooking() {
  const checkoutCard = document.querySelector('.checkout-card');
  if (!checkoutCard || !window.location.pathname.includes('checkout')) return;
  
  const groupHTML = `
    <div style="margin-top: 20px; padding: 16px; background: linear-gradient(135deg, #10B981, #06B6D4); color: white; border-radius: 12px;">
      <h4 style="margin-bottom: 8px;">👥 Group Booking Discount</h4>
      <p style="font-size: 13px; opacity: 0.9; margin-bottom: 12px;">Book 5+ tickets and get 15% off!</p>
      <button class="btn btn-white" style="width: 100%;" onclick="applyGroupDiscount()">Apply Discount</button>
    </div>
  `;
  
  const paymentCard = document.querySelectorAll('.checkout-card')[2];
  if (paymentCard) {
    paymentCard.insertAdjacentHTML('afterend', groupHTML);
  }
}

addGroupBooking();

window.applyGroupDiscount = function() {
  showToast('success', '15% Discount Applied!', 'Group booking discount activated');
};

// ========================================
// 56. PRICE COMPARISON
// ========================================
function addPriceComparison() {
  const sidebar = document.querySelector('.detail-sidebar');
  if (!sidebar) return;
  
  const priceTypes = [
    { type: 'Early Bird', price: 'Rp 75.000', badge: '🎯 Best Value', color: '#10B981' },
    { type: 'Normal', price: 'Rp 100.000', badge: 'Standard', color: '#3B82F6' },
    { type: 'VIP', price: 'Rp 150.000', badge: '⭐ Premium', color: '#F59E0B' }
  ];
  
  const comparisonHTML = `
    <div style="margin-top: 20px;">
      <h4 style="font-size: 16px; margin-bottom: 12px;">💰 Ticket Options</h4>
      ${priceTypes.map(p => `
        <div style="padding: 12px; background: var(--light); border-radius: 10px; margin-bottom: 8px; border-left: 4px solid ${p.color};">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">${p.type}</div>
              <div style="font-size: 11px; color: ${p.color};">${p.badge}</div>
            </div>
            <div style="font-weight: 700; color: ${p.color};">${p.price}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  const priceCard = sidebar.querySelector('.price-card');
  if (priceCard) {
    priceCard.insertAdjacentHTML('afterend', comparisonHTML);
  }
}

addPriceComparison();

// ========================================
// 57. TESTIMONIALS CAROUSEL
// ========================================
function addTestimonials() {
  const detailMain = document.querySelector('.detail-main');
  if (!detailMain) return;
  
  const testimonials = [
    { name: 'Budi S.', text: 'Event terbaik yang pernah saya ikuti! Sangat terorganisir.', rating: 5 },
    { name: 'Siti R.', text: 'Tempatnya bagus, acaranya seru, recommended!', rating: 5 },
    { name: 'Andi P.', text: 'Worth it banget! Bakal datang lagi next year.', rating: 4 }
  ];
  
  const testimonialsHTML = `
    <div style="margin-top: 32px;">
      <h3>💬 Apa Kata Mereka</h3>
      <div style="display: grid; gap: 16px; margin-top: 16px;">
        ${testimonials.map(t => `
          <div style="background: var(--light); padding: 20px; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <div style="font-weight: 600;">${t.name}</div>
              <div style="color: #F59E0B;">${'⭐'.repeat(t.rating)}</div>
            </div>
            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">"${t.text}"</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  detailMain.insertAdjacentHTML('beforeend', testimonialsHTML);
}

addTestimonials();

// ========================================
// INITIALIZE ALL ON PAGE LOAD
// ========================================
window.addEventListener('load', () => {
  console.log('%c✅ All 57 Features Initialized!', 'color: #10B981; font-size: 16px; font-weight: bold;');
  
  // Show welcome toast
  setTimeout(() => {
    showToast('success', 'Welcome! 🎉', 'All features loaded successfully');
  }, 1000);
});

// ========================================
// END OF ENHANCED MAIN.JS V2
// ========================================// ========================================
// NESA CONNECT - ENHANCED JAVASCRIPT V2
// File: js/main.js
// ALL FEATURES INCLUDED! 🔥
// ========================================

// ========================================
// 1. DARK MODE TOGGLE
// ========================================
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    
    showToast('success', 'Theme Changed', `Switched to ${newTheme} mode!`);
  });
}

function updateThemeIcon() {
  if (themeToggle) {
    const theme = html.getAttribute('data-theme');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

// ========================================
// 2. TOAST NOTIFICATIONS
// ========================================
function showToast(type, title, message) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close">×</div>
  `;
  
  container.appendChild(toast);
  
  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Add slideOutRight animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutRight {
    to {
      opacity: 0;
      transform: translateX(400px);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// 3. HERO CAROUSEL
// ========================================
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselDots = document.querySelectorAll('.carousel-dot');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');

let currentSlide = 0;
let autoPlayInterval;

function updateCarousel() {
  if (carouselWrapper) {
    carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    carouselDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
}

function nextSlide() {
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

if (carouselNext) {
  carouselNext.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });
}

if (carouselPrev) {
  carouselPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
}

carouselDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
  });
});

function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

if (carouselWrapper) {
  startAutoPlay();
}

// ========================================
// 4. WISHLIST FUNCTIONALITY
// ========================================
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

document.querySelectorAll('.wishlist-btn').forEach(btn => {
  const eventId = btn.dataset.eventId || Math.random().toString(36).substr(2, 9);
  btn.dataset.eventId = eventId;
  
  // Load saved state
  if (wishlist.includes(eventId)) {
    btn.classList.add('active');
    btn.textContent = '❤️';
  }
  
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (btn.classList.contains('active')) {
      // Remove from wishlist
      btn.classList.remove('active');
      btn.textContent = '🤍';
      wishlist = wishlist.filter(id => id !== eventId);
      showToast('info', 'Removed', 'Event removed from wishlist');
    } else {
      // Add to wishlist
      btn.classList.add('active');
      btn.textContent = '❤️';
      wishlist.push(eventId);
      showToast('success', 'Saved!', 'Event added to wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  });
});

// ========================================
// 5. BACK TO TOP BUTTON
// ========================================
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ========================================
// 6. NAVBAR SCROLL EFFECT
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ========================================
// 7. NOTIFICATION SYSTEM
// ========================================
const notificationBell = document.querySelector('.notification-bell');
let notifications = [
  { title: 'New Event', message: 'Workshop Content Creator just added!', time: '2m ago' },
  { title: 'Reminder', message: 'Opening Night starts in 2 days', time: '1h ago' },
  { title: 'Discount', message: '20% off for early bird tickets', time: '3h ago' }
];

if (notificationBell) {
  // Update badge count
  const badge = notificationBell.querySelector('.notification-badge');
  if (badge) {
    badge.textContent = notifications.length;
  }
  
  notificationBell.addEventListener('click', () => {
    showToast('info', 'Notifications', `You have ${notifications.length} new notifications`);
  });
}

// ========================================
// 8. COUNTER ANIMATION FOR STATS
// ========================================
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current) + (target > 90 ? '%' : '+');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + (target > 90 ? '%' : '+');
    }
  };
  
  updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stats-number');
      counters.forEach(counter => animateCounter(counter));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) {
  statsObserver.observe(statsBanner);
}

// ========================================
// 9. FILTER PILLS INTERACTION
// ========================================
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', function() {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    
    const category = this.textContent.trim();
    showToast('info', 'Filter Applied', `Showing ${category} events`);
  });
});

// ========================================
// 10. SEARCH FUNCTIONALITY
// ========================================
const searchInputs = document.querySelectorAll('.search-input, .nav-search input');
const searchBtns = document.querySelectorAll('.search-bar .btn-primary');

searchBtns.forEach((btn, index) => {
  const input = searchInputs[index];
  
  if (btn && input) {
    btn.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) {
        showToast('info', 'Searching', `Looking for "${query}"...`);
        setTimeout(() => {
          showToast('success', 'Found!', `Found 12 events matching "${query}"`);
        }, 1000);
      } else {
        showToast('warning', 'Empty Search', 'Please enter a search keyword');
      }
    });
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btn.click();
      }
    });
  }
});

// ========================================
// 11. SCROLL ANIMATION - FADE IN UP
// ========================================
function initScrollAnimation() {
  const animateElements = document.querySelectorAll(
    '.event-card, .category-card, .search-section, .hero, ' +
    '.auth-card, .auth-aside, .detail-main, .detail-sidebar, ' +
    '.checkout-card, .upload-area, .hero-carousel'
  );
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
  });
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animateElements.forEach(el => scrollObserver.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimation);
} else {
  initScrollAnimation();
}

window.addEventListener('load', () => {
  const hero = document.querySelector('.hero, .hero-carousel');
  const navbar = document.querySelector('.navbar');
  
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'translateY(0)';
  }
  
  if (navbar) {
    navbar.style.opacity = '1';
    navbar.style.transform = 'translateY(0)';
  }
});

// ========================================
// 12. LOGIN FORM VALIDATION
// ========================================
const loginForm = document.querySelector('.auth-card form');
if (loginForm && window.location.pathname.includes('login')) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.querySelector('input[type="text"], input[type="email"]')?.value;
    const password = document.querySelector('input[type="password"]')?.value;
    
    if (!username || !password) {
      showToast('error', 'Login Failed', 'Username and password are required!');
      return;
    }
    
    if (password.length < 6) {
      showToast('warning', 'Weak Password', 'Password must be at least 6 characters!');
      return;
    }
    
    showToast('success', 'Login Successful', 'Welcome back! Redirecting...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}

// ========================================
// 13. SIGNUP FORM VALIDATION
// ========================================
const signupForm = document.querySelector('.auth-card form');
if (signupForm && window.location.pathname.includes('signup')) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('input[type="email"]')?.value;
    const password = document.querySelector('input[id="password"]')?.value;
    const confirm = document.querySelector('input[id="confirm-password"]')?.value;
    
    if (!email || !password || !confirm) {
      showToast('error', 'Signup Failed', 'All fields are required!');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address!');
      return;
    }
    
    if (password.length < 6) {
      showToast('warning', 'Weak Password', 'Password must be at least 6 characters!');
      return;
    }
    
    if (password !== confirm) {
      showToast('error', 'Password Mismatch', 'Passwords do not match!');
      return;
    }
    
    showToast('success', 'Account Created', 'Registration successful! Redirecting to login...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  });
}

// ========================================
// 14. CREATE EVENT FORM
// ========================================
const createEventForm = document.querySelector('.create-container form');
if (createEventForm) {
  createEventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.querySelector('input[id="title"]')?.value;
    const date = document.querySelector('input[id="date"]')?.value;
    const location = document.querySelector('input[id="location"]')?.value;
    const description = document.querySelector('textarea[id="description"]')?.value;
    
    if (!title || !date || !location || !description) {
      showToast('error', 'Incomplete Form', 'All required fields must be filled!');
      return;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      showToast('error', 'Invalid Date', 'Event date cannot be in the past!');
      return;
    }
    
    if (description.length < 100) {
      showToast('warning', 'Description Too Short', 'Description must be at least 100 characters!');
      return;
    }
    
    showToast('success', 'Event Created', `"${title}" has been published successfully! 🎉`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });
}

// ========================================
// 15. IMAGE UPLOAD PREVIEW
// ========================================
const uploadBox = document.querySelector('.upload-box');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';

if (uploadBox) {
  document.body.appendChild(fileInput);
  
  uploadBox.addEventListener('click', () => {
    fileInput.click();
  });
  
  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = 'var(--primary)';
    uploadBox.style.background = 'rgba(30,64,175,0.05)';
  });
  
  uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = '';
    uploadBox.style.background = '';
  });
  
  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '';
    uploadBox.style.background = '';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      showToast('error', 'Invalid File', 'Please upload an image file!');
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });
}

function handleImageUpload(file) {
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', 'File Too Large', 'Image must be less than 5MB!');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    uploadBox.innerHTML = `
      <img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
    `;
    showToast('success', 'Image Uploaded', 'Poster image uploaded successfully!');
  };
  reader.readAsDataURL(file);
}

// ========================================
// 16. CHECKOUT PAYMENT
// ========================================
const paymentBtn = document.querySelector('.checkout-card .btn-primary');
if (paymentBtn && window.location.pathname.includes('checkout')) {
  paymentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const name = document.querySelector('input[id="name"]')?.value;
    const email = document.querySelector('input[id="email"]')?.value;
    const phone = document.querySelector('input[id="phone"]')?.value;
    
    if (!name || !email || !phone) {
      showToast('error', 'Incomplete Form', 'Please fill in all required fields!');
      return;
    }
    
    paymentBtn.textContent = 'Processing...';
    paymentBtn.disabled = true;
    
    showToast('info', 'Processing Payment', 'Please wait while we process your payment...');
    
    setTimeout(() => {
      showToast('success', 'Payment Successful', 'Ticket will be sent to your email! 🎉');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }, 2000);
  });
}

// ========================================
// 17. SHARE BUTTON
// ========================================
const shareButtons = document.querySelectorAll('.btn-outline, button');
shareButtons.forEach(btn => {
  if (btn.textContent.includes('Bagikan') || btn.textContent.includes('📤')) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const shareData = {
        title: 'Nesa Connect 2025',
        text: 'Check out this awesome campus event!',
        url: window.location.href
      };
      
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showToast('success', 'Shared!', 'Event shared successfully');
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.log('Share error:', err);
          }
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('success', 'Link Copied!', 'Event link copied to clipboard 📋');
        } catch (err) {
          showToast('info', 'Share Link', window.location.href);
        }
      }
    });
  }
});

// ========================================
// 18. SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ========================================
// 19. CATEGORY CARD CLICK
// ========================================
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', function() {
    const category = this.querySelector('h4')?.textContent;
    showToast('info', 'Category Selected', `Showing ${category} events`);
  });
});

// ========================================
// 20. EVENT CARD CLICK
// ========================================
document.querySelectorAll('.event-card').forEach(card => {
  card.addEventListener('click', function(e) {
    if (!e.target.closest('.btn') && !e.target.closest('.wishlist-btn')) {
      window.location.href = 'detail.html';
    }
  });
});

// ========================================
// 21. FLOATING ACTION BUTTON
// ========================================
const fab = document.querySelector('.fab');
if (fab) {
  if (window.location.pathname.includes('create')) {
    fab.style.display = 'none';
  }
  
  let fabLastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 300) {
      fab.style.opacity = '1';
      fab.style.transform = currentScroll > fabLastScroll ? 'scale(0.8)' : 'scale(1)';
    } else {
      fab.style.opacity = '0';
    }
    
    fabLastScroll = currentScroll;
  });
}

// ========================================
// 22. SOCIAL LOGIN BUTTONS
// ========================================
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const platform = btn.classList.contains('google') ? 'Google' :
                    btn.classList.contains('twitter') ? 'Twitter' : 'Facebook';
    
    showToast('info', 'Coming Soon', `${platform} login will be available soon! 🚀`);
  });
});

// ========================================
// 23. VIEW COUNTER (Simulated)
// ========================================
function updateViewCount() {
  const viewCount = Math.floor(Math.random() * 500) + 100;
  console.log(`Page viewed ${viewCount} times`);
}

updateViewCount();

// ========================================
// 24. CONSOLE WELCOME MESSAGE
// ========================================
console.log('%c🎉 Nesa Connect V2', 'color: #3B82F6; font-size: 24px; font-weight: bold;');
console.log('%c📍 Location: Surabaya, Indonesia', 'color: #64748B; font-size: 14px;');
console.log('%c✨ All features loaded successfully!', 'color: #10B981; font-size: 14px;');
console.log('%c🔥 New Features: Dark Mode, Carousel, Wishlist, Toasts & More!', 'color: #F59E0B; font-size: 14px;');

// ========================================
// 25. ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
  console.error('Error caught:', e.message);
  showToast('error', 'Oops!', 'Something went wrong. Please try again.');
});

// ========================================
// 26. PREVENT FORM RESUBMISSION
// ========================================
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// ========================================
// END OF ENHANCED MAIN.JS
// ========================================