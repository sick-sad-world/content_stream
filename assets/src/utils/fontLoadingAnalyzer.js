export default function fontLoadingAnalyzer(fonts = [], className = 'fonts-loaded') {

  if (sessionStorage.fontsLoadedFoutWithClass) {
    document.documentElement.classList.add(className);
    return;
  }

  if ('fonts' in document) {
    Promise.all(fonts.map(document.fonts.load)).then(() => {
      console.log(document.fonts);
      document.documentElement.classList.add(className);
      sessionStorage.fontsLoadedFoutWithClass = true;
    });
  }
}