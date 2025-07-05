function insertReply(text) {
  // Target Gmail's reply textarea (compose or reply box)
  const editableDiv = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');

  if (!editableDiv) {
    console.error("Reply compose box not found. Please click 'Reply' first.");
    return;
  }

  editableDiv.focus();

  // Insert the reply cleanly
  editableDiv.innerText = text;

  // Move the cursor to the end
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(editableDiv);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getEmailBody") {
    const email = document.querySelector(".ii.gt div");
    sendResponse({ emailBody: email ? email.innerText.trim().slice(0, 2000) : "No email found." });
  }
  if (request.action === "insertReply") {
    insertReply(request.replyText);
  }
});