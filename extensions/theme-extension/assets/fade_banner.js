let acceptTerms = document.querySelector('button.accept')
let rejectTerms = document.querySelector('button.reject')
let banner = document.querySelector('.awesoon-wrapper .banner')
let wrapper = document.querySelector('.awesoon-wrapper')


document.addEventListener('DOMContentLoaded', function () {
  async function getSomething() {
    // Check if the boolean is already set in localStorage and not expired
    const cachedData = localStorage.getItem('cachedBoolean');
    const expirationTime = localStorage.getItem('expirationTime');
    const currentTime = new Date().getTime();

    if (cachedData && expirationTime && currentTime < expirationTime) {
      console.log("Cached data is still valid:", cachedData);
      return;
    }

    const response = await fetch('/apps/cookie_ray_sma_fa/fetchOpenAIResponse', {
      method: 'GET',
    });
    console.log(response)
    console.log("koskesh madar jende")
    const textResponse = await response.text();
    const jsonResponse = JSON.parse(textResponse)

    console.log("Full API Response:", textResponse + "\n\n\n\n\n");
    console.log("Parsed JSON Response:", jsonResponse + "\n\n\n");


    try {
      // Extract the message content
      const messageContent = jsonResponse.choices[0].message.content;
      console.log("Extracted Message Content:", messageContent);

      // Remove backslashes used for escaping in the JSON string
      const cleanedContent = messageContent.replace(/\\/g, '');

      // Populate the #aiResponseBox with the cleaned content
      document.getElementById('aiResponseBox').textContent = cleanedContent;
    } catch (error) {
      // Log any errors
      console.error("Error fetching or processing data:", error);
    }




    //fade the banner
    wrapper.style.display = 'flex'
    setTimeout(function () {
      banner.style.opacity = '1'
    }, 300)




    // Cache the new data with an expiration time of 7 days
    localStorage.setItem('cachedBoolean', textResponse);
    const sevenDaysLater = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('expirationTime', sevenDaysLater);



    return jsonResponse;
  }
  async function countBannerView() {
    const response = await fetch('/apps/cookie_ray_sma_fa/countBannerView');
    try {
      console.log("koskesh madar jende")
      if (response.ok) {
        const data = await response.json();
        console.log("View Counter");
      } else {
        throw new Error('Unable to count');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  countBannerView()
  getSomething();
});




function fadeBanner() {
  banner.style.opacity = '0'
  setTimeout(function wrapperFade() {
    wrapper.style.display = 'none'
  }, 1000)
}

[acceptTerms, rejectTerms].forEach(element => element.addEventListener('click', fadeBanner));
