// ui_effects/intervallyTyped.js
export const useTypeWriterEffect = () => {
  const startTyping = (elementsSelector, typingDelay) => {
    const elements = document.querySelectorAll(elementsSelector);
    elements.forEach((element, index) => {
      let originalText = '';
      const dataName = element.dataset.name;
      switch (dataName) {
        case 'a':
          originalText = 'Content A';
          break;
        case 'b':
          originalText = 'Content B';
          break;
        default:
          originalText = ''; // Default content or leave it empty
      }

      element.innerText = '';
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex < originalText.length) {
          element.innerText += originalText[charIndex];
          charIndex++;
          setTimeout(typeChar, typingDelay);
        }
      };

      setTimeout(typeChar, typingDelay * index);
    });
  };

  return startTyping;
};
