// Extract the visible email body from Gmail
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getEmailBody") {
    const emailElement = document.querySelector(".ii.gt div");
    sendResponse({ emailBody: emailElement ? emailElement.innerText.trim().slice(0, 2000) : null });
  }
});