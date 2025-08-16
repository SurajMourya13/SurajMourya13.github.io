// brokerpage.js
// Hamburger menu functionality
const hamburgerBtn = $(".hamburger-btn");
const mainNav = $("nav"); // Assuming your main navigation element is just <nav>

hamburgerBtn.on("click", function () {
  mainNav.toggleClass("active");
  $(this).find("i").toggleClass("fa-bars fa-times"); // Toggle icon
});

// Dropdown toggle for mobile menu
$(".dropdown > a").on("click", function (e) {
  // Target the 'More' link directly
  if ($(window).width() <= 768) {
    // Only apply this behavior on mobile
    e.preventDefault(); // Prevent default link behavior
    $(this).next(".dropdown-menu").slideToggle(200);
    $(this).find("i").toggleClass("fa-caret-down fa-caret-up"); // Toggle caret icon
  }
});

// Close mobile menu and dropdown when clicking outside
$(document).on("click touchstart", function (e) {
  if ($(window).width() <= 768) {
    // Only apply on mobile
    if (mainNav.hasClass("active") && !$(e.target).closest("header").length) {
      mainNav.removeClass("active");
      hamburgerBtn.find("i").removeClass("fa-times").addClass("fa-bars"); // Reset hamburger icon
      $(".dropdown-menu").slideUp(200); // Close dropdown if open
      $(".dropdown > a i").removeClass("fa-caret-up").addClass("fa-caret-down"); // Reset dropdown caret
    }
  }
});

// Reset menu state on window resize (e.g., when rotating phone or resizing browser)
$(window).resize(function () {
  if ($(window).width() > 768) {
    mainNav.removeClass("active").css("display", ""); // Ensure nav is visible for desktop
    hamburgerBtn.hide(); // Hide hamburger icon on desktop
    $(".dropdown-menu").css("display", ""); // Ensure dropdown is hidden (will be shown on hover by CSS)
    $(".dropdown > a i").removeClass("fa-caret-up").addClass("fa-caret-down"); // Reset dropdown caret
  } else {
    // For mobile, if menu was open and resized, keep it open if active, but hide dropdown
    hamburgerBtn.show(); // Ensure hamburger is visible on mobile
    if (mainNav.hasClass("active")) {
      $(".dropdown-menu").slideUp(0); // Ensure dropdown is hidden until clicked
      $(".dropdown > a i").removeClass("fa-caret-up").addClass("fa-caret-down");
    }
  }
});

// Initial display check for hamburger button on load
if ($(window).width() > 768) {
  hamburgerBtn.hide();
} else {
  hamburgerBtn.show();
}
