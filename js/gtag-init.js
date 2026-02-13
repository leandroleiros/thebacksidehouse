/* Google Analytics (gtag) - carga externa para CSP sin 'unsafe-inline' */
window.dataLayer = window.dataLayer || [];
function gtag() {
  try {
    if (window.dataLayer) {
      dataLayer.push(arguments);
    }
  } catch (e) {
    console.warn("Google Analytics error:", e);
  }
}
try {
  gtag("js", new Date());
  gtag("config", "G-CF5WG8LDFJ");
} catch (e) {
  console.warn("Google Analytics config error:", e);
}
