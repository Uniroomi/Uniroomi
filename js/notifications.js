// Notification System for UniRoomi
class NotificationSystem {
  constructor() {
    this.init();
  }

  init() {
    // Add notification bell click handler if not already added
    if (!window.auth) {
      console.warn('Firebase auth not initialized, notifications may not work properly');
    }
    
    // Add click handler for notification bell
    $(document).on('click', '.notification-bell', (e) => {
      e.preventDefault();
      this.toggleNotifications();
    });

    // Add click handlers for notification actions
    $(document).on('click', '.mark-read-btn', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const notificationId = $(e.currentTarget).data('id');
      this.markAsRead(notificationId);
    });

    $(document).on('click', '.mark-all-read-btn', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.markAllAsRead();
    });

    $(document).on('click', '.notification-item', (e) => {
      if (!$(e.target).closest('.mark-read-btn').length) {
        const notificationId = $(e.currentTarget).data('id');
        this.handleNotificationClick(notificationId);
      }
    });

    // Initialize notification badge
    this.updateNotificationBadge();
  }

  toggleNotifications() {
    const existingDropdown = $('.notification-dropdown');
    
    if (existingDropdown.length > 0) {
      existingDropdown.fadeOut(300, function() {
        $(this).remove();
      });
    } else {
      this.showNotificationDropdown();
    }
  }

  showNotificationDropdown() {
    const dropdownHtml = this.getNotificationDropdownHtml();
    $('body').append(dropdownHtml);
    
    // Position the dropdown near the notification bell
    const bell = $('.notification-bell');
    const dropdown = $('.notification-dropdown');
    
    if (bell.length > 0 && dropdown.length > 0) {
      const bellOffset = bell.offset();
      const bellWidth = bell.outerWidth();
      const dropdownWidth = 320; // Fixed width for dropdown
      
      dropdown.css({
        top: bellOffset.top + bell.outerHeight() + 10,
        left: bellOffset.left + bellWidth - dropdownWidth + 20
      });
    }
    
    $('.notification-dropdown').fadeIn(300);
    
    // Close dropdown when clicking outside
    $(document).on('click.notification', (e) => {
      if (!$(e.target).closest('.notification-bell, .notification-dropdown').length) {
        $('.notification-dropdown').fadeOut(300, function() {
          $(this).remove();
        });
        $(document).off('click.notification');
      }
    });
  }

  getNotificationDropdownHtml() {
    const notifications = this.getMockNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return `
      <div class="notification-dropdown">
        <div class="notification-header">
          <h3>Notifications</h3>
          <button class="mark-all-read-btn">Mark all as read</button>
        </div>
        <div class="notification-list">
          ${notifications.length > 0 ? 
            notifications.map(notification => this.renderNotificationItem(notification)).join('') :
            '<div class="no-notifications">No notifications</div>'
          }
        </div>
        <div class="notification-footer">
          <a href="#" class="view-all-notifications">View all notifications</a>
        </div>
      </div>
    `;
  }

  getMockNotifications() {
    return [
      {
        id: 1,
        type: 'booking',
        title: 'New Booking Request',
        message: 'John Doe requested to book your property',
        time: '2 hours ago',
        read: false,
        icon: 'fa-home'
      },
      {
        id: 2,
        type: 'message',
        title: 'New Message',
        message: 'You have a new message from Sarah Johnson',
        time: '5 hours ago',
        read: false,
        icon: 'fa-envelope'
      },
      {
        id: 3,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking for Wits Campus has been confirmed',
        time: '1 day ago',
        read: true,
        icon: 'fa-check-circle'
      },
      {
        id: 4,
        type: 'system',
        title: 'Profile Update',
        message: 'Your profile has been successfully updated',
        time: '2 days ago',
        read: true,
        icon: 'fa-user'
      }
    ];
  }

  renderNotificationItem(notification) {
    const readClass = notification.read ? 'read' : 'unread';
    
    return `
      <div class="notification-item ${readClass}" data-id="${notification.id}">
        <div class="notification-icon">
          <i class="fa ${notification.icon}"></i>
        </div>
        <div class="notification-content">
          <h4>${notification.title}</h4>
          <p>${notification.message}</p>
          <span class="notification-time">${notification.time}</span>
        </div>
        <div class="notification-actions">
          ${!notification.read ? `
            <button class="mark-read-btn" data-id="${notification.id}" title="Mark as read">
              <i class="fa fa-check"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  markAsRead(notificationId) {
    // Update UI
    $(`.notification-item[data-id="${notificationId}"]`).removeClass('unread').addClass('read');
    $(`.notification-item[data-id="${notificationId}"] .mark-read-btn`).remove();
    
    // Update badge
    this.updateNotificationBadge();
    
    // Here you would typically make an API call to mark as read in the database
    console.log(`Marked notification ${notificationId} as read`);
  }

  markAllAsRead() {
    $('.notification-item').removeClass('unread').addClass('read');
    $('.mark-read-btn').remove();
    this.updateNotificationBadge();
    
    // Here you would typically make an API call to mark all as read
    console.log('Marked all notifications as read');
  }

  handleNotificationClick(notificationId) {
    // Handle notification click - could navigate to relevant page
    console.log(`Notification ${notificationId} clicked`);
    this.toggleNotifications(); // Close dropdown
  }

  updateNotificationBadge() {
    const notifications = this.getMockNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = $('.notification--num');
    
    if (unreadCount > 0) {
      badge.text(unreadCount).show();
    } else {
      badge.text('').hide();
    }
  }

  // Method to add new notifications (can be called from other parts of the app)
  addNotification(notification) {
    // Here you would typically add to database and refresh the dropdown
    console.log('New notification added:', notification);
    this.updateNotificationBadge();
  }
}

// Initialize notification system when DOM is ready
$(document).ready(function() {
  window.notificationSystem = new NotificationSystem();
});
