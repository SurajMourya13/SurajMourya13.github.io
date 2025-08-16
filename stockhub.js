// Function to fetch stock data
async function fetchData(
  symbol,
  elementId,
  apiFunction = "GLOBAL_QUOTE",
  currency = "stocks"
) {
  const apiKey = "VMXN77GOMS774LW4"; // Replace with your API key
  const apiUrl =
    currency === "crypto"
      ? `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&market=USD&apikey=${apiKey}`
      : `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      const price = data["Global Quote"]["05. price"];
      const changePercent = data["Global Quote"]["10. change percent"];
      document
        .getElementById(elementId)
        .querySelector("p").textContent = `$${price} (${changePercent})`;
    } else if (data["Realtime Currency Exchange Rate"]) {
      const price = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
      document
        .getElementById(elementId)
        .querySelector("p").textContent = `$${parseFloat(price).toFixed(2)}`;
    } else {
      document.getElementById(elementId).querySelector("p").textContent =
        "Data unavailable";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById(elementId).querySelector("p").textContent =
      "Error fetching data";
  }
}

// Toggle dropdown visibility and fetch data for additional stocks
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const isVisible = dropdown.style.display === "block";
  dropdown.style.display = isVisible ? "none" : "block";

  if (!isVisible) {
    // Fetch data for all additional stocks in the dropdown
    const cards = dropdown.querySelectorAll(".card");
    cards.forEach((card) => {
      const symbol = card.querySelector("h3").textContent.split(" ")[0];
      fetchData(
        symbol,
        card.id,
        card.id.includes("crypto") ? "CURRENCY_EXCHANGE_RATE" : "GLOBAL_QUOTE"
      );
    });
  }
}

// Updated global stocks array with NVIDIA and Amazon
const globalStocks = [
  "AAPL",
  "MSFT",
  "TSLA",
  "NVDA",
  "AMZN",
  "META",
  "BRK.B",
  "V",
  "JNJ",
];
const indianStocks = ["RELIANCE.BSE", "TCS.BSE", "INFY.BSE"];
const cryptos = [
  "BTCUSD",
  "ETHUSD",
  "BNBUSD",
  "XRPUSD",
  "ADAUSD",
  "SOLUSD",
  "DOTUSD",
  "DOGEUSD",
  "MATICUSD",
  "LTCUSD",
];

// Fetch live data for all stocks
globalStocks.forEach((symbol, index) =>
  fetchData(symbol, `global${index + 1}`)
);
indianStocks.forEach((symbol, index) => fetchData(symbol, `india${index + 1}`));
cryptos.forEach((symbol, index) => fetchData(symbol, `crypto${index + 1}`));

// Load stock after clicking
function loadStock(symbol) {
  let container = document.getElementById("iframe-stock");

  if (!container) {
    console.error("Stock iframe container not found!");
    return;
  }

  let url = `https://www.tradingview-widget.com/embed-widget/symbol-overview/?locale=en#%7B%22symbols%22%3A%5B%5B%22${symbol}%22%2C%22${symbol}%7C1D%22%5D%5D%7D`;

  container.innerHTML = `<iframe scrolling='no' allowtransparency='true' frameborder='0' 
      style='user-select: none; box-sizing: border-box; display: block; height: 500px; width: 100%;' 
      src='${url}'></iframe>`;
}

// Load cryptocurrency chart after clicking
function loadCryptoChart(symbol) {
  let container = document.getElementById("iframe-crypto");

  if (!container) {
    console.error("Crypto iframe container not found!");
    return;
  }

  let url = `https://www.tradingview-widget.com/embed-widget/symbol-overview/?locale=en#%7B%22symbols%22%3A%5B%5B%22BINANCE%3A${symbol}%22%2C%22BINANCE%3A${symbol}%7C1D%22%5D%5D%7D`;

  container.innerHTML = `<iframe scrolling='no' allowtransparency='true' frameborder='0' 
      style='user-select: none; box-sizing: border-box; display: block; height: 500px; width: 100%;' 
      src='${url}'></iframe>`;
}

// Load default charts on page load
window.onload = function () {
  loadStock("AAPL"); // Load default stock (Apple)
  loadCryptoChart("BTCUSDT"); // Load default crypto (Bitcoin)
};

// Scroll Functionality for Both Sections
document.addEventListener("DOMContentLoaded", function () {
  function setupCarousel(section) {
    const container = section.querySelector(".cards");
    const leftBtn = section.querySelector(".left-btn");
    const rightBtn = section.querySelector(".right-btn");

    if (!container || !leftBtn || !rightBtn) return;

    const cardWidth = container.querySelector(".card").offsetWidth + 20; // Card width + gap
    const visibleCards = 2;
    const scrollAmount = cardWidth * visibleCards; // Scroll by 3 cards

    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  // Apply scrolling to both sections
  document.querySelectorAll(".cards-container").forEach(setupCarousel);
});

function toggleMenu() {
  let navbar = document.getElementById("navbar");
  navbar.classList.toggle("active");
}

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
