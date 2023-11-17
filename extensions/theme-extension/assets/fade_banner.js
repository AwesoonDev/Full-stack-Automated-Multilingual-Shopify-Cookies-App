let acceptTerms = document.querySelector('button.accept')
let rejectTerms = document.querySelector('button.reject')
let banner = document.querySelector('.awesoon-wrapper .banner')
let wrapper = document.querySelector('.awesoon-wrapper')


document.addEventListener('DOMContentLoaded', function () {

  // Fetch and cache data
  async function fetchAndCacheData() {
    const response = await fetch('/apps/cookie_ray_sma_fa/fetchOpenAIResponse', { method: 'GET' });
    const textResponse = await response.text();
    cacheData(textResponse);
    return JSON.parse(textResponse);
  }

  // Cache the data with an expiration time of 7 days
  function cacheData(data) {
    localStorage.setItem('cachedBoolean', data);
    const sevenDaysLater = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('expirationTime', sevenDaysLater);
  }

  // Get data from cache if available
  function getCachedData() {
    const cachedData = localStorage.getItem('cachedBoolean');
    const expirationTime = localStorage.getItem('expirationTime');
    const currentTime = new Date().getTime();

    if (cachedData && expirationTime && currentTime < expirationTime) {
      return JSON.parse(cachedData);
    }
    return null;
  }

  // Initialize and handle data
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
      const messageContent = data.choices[0].message.content.replace(/\\/g, '').replace('"', '');
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


acceptTerms.addEventListener('click', async function () {
  console.log("Accepted Terms");
  await countBannerView(true);
  fadeBanner();
});

rejectTerms.addEventListener('click', async function () {
  console.log("Rejected Terms");
  await countBannerView(false);
  fadeBanner();
});