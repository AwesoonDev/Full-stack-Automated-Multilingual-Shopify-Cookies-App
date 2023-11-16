export function fadeInOut() {
  $(document).ready(function () {
    // Function to fade image in and out
    function fadeImage() {
      $('#companyLogoImage').fadeOut(1000, function () {
        $(this).fadeIn(1000, fadeImage);
      });
    }

    fadeImage(); // Initial call to start the fade cycle
  });
}