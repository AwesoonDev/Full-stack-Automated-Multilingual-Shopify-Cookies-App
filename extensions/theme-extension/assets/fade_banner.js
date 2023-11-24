let acceptTerms = document.querySelector('button.accept')
let rejectTerms = document.querySelector('button.reject')
let banner = document.querySelector('.awesoon-wrapper .banner')
let wrapper = document.querySelector('.awesoon-wrapper')


document.addEventListener('DOMContentLoaded', function () {



  if (userDecisionExists()) {
    return;
  } else {
    countBannerView(true);
  }


  // Fetch and cache data
  async function fetchAndCacheData() {
    const response = await fetch('/apps/cookie_ray_sma_fa/fetchOpenAIResponse', { method: 'GET' });
    const textResponse = await response.text();
    cacheData(textResponse);
    return JSON.parse(textResponse);
  }

  function cacheData(data) {
    localStorage.setItem('cachedBoolean', data);
    const sevenDaysLater = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('expirationTime', sevenDaysLater);
  }

  function getCachedData() {
    const cachedData = localStorage.getItem('cachedBoolean');
    const expirationTime = localStorage.getItem('expirationTime');
    const currentTime = new Date().getTime();

    if (cachedData && expirationTime && currentTime < expirationTime) {
      return JSON.parse(cachedData);
    }
    return null;
  }



  async function initializeData() {
    const cachedData = getCachedData();
    if (cachedData) {
      processData(cachedData);
      return;
    }

    try {
      const data = await fetchAndCacheData();
      processData(data);
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    }
  }

  // Process and display data
  function processData(data) {
    try {
      // Extract and clean the message content
      const messageContent = data
      document.getElementById('aiResponseBox').textContent = messageContent;

      // Display and animate the banner
      fadeBannerIn();
    } catch (error) {
      console.error("Error processing data:", error);
    }
  }

  // Fade the banner in
  function fadeBannerIn() {
    wrapper.style.display = 'flex';
    setTimeout(function () {
      banner.style.opacity = '1';
    }, 2000);
  }


  initializeData();
});

async function countBannerView(accepted = null) {
  try {
    const body = accepted !== null ? JSON.stringify({ accepted }) : null;
    const response = await fetch('/apps/cookie_ray_sma_fa/countBannerView', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });

    if (response.ok) {
      const data = await response.json();
      console.log("View Counter", data);
    } else {
      throw new Error('Unable to count');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


function fadeBanner() {
  banner.style.opacity = '0'
  setTimeout(function wrapperFade() {
    wrapper.style.display = 'none'
  }, 2000)
}


function setApprovalCookies() {
  document.cookie = "userConsent=accepted; path=/; max-age=" + (60 * 60 * 24 * 365); // 1 year
  console.log("Cookies and data settings set for approval");
}


function setRejectionCookies() {
  document.cookie = "userConsent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  console.log("Cookies and data settings set for rejection");
}


function userDecisionExists() {
  const userDecision = localStorage.getItem('userDecision');
  const decisionTime = localStorage.getItem('decisionTime');
  const currentTime = new Date().getTime();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  return userDecision && decisionTime && (currentTime - decisionTime < thirtyDays);
}

function setUserDecision(decision) {
  localStorage.setItem('userDecision', decision);
  localStorage.setItem('decisionTime', new Date().getTime());
}



acceptTerms.addEventListener('click', async function () {
  console.log("Accepted Terms");
  setApprovalCookies();
  setUserDecision('accepted'); // Save user decision
  await countBannerView(true);
  fadeBanner();
});

rejectTerms.addEventListener('click', async function () {
  console.log("Rejected Terms");
  setRejectionCookies();
  setUserDecision('rejected'); // Save user decision
  await countBannerView(false);
  fadeBanner();
});