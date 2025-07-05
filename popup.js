document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate");
  const saveBtn = document.getElementById("save");
  const toggleBtn = document.getElementById("toggleKey");
  const groqKeyInput = document.getElementById("groqKey");
  const status = document.getElementById("status");
  const resultBox = document.getElementById("result");

  // Load existing API key
  chrome.storage.local.get("GROQ_API_KEY", (data) => {
    groqKeyInput.value = data.GROQ_API_KEY || "";
  });

  // Toggle show/hide
  toggleBtn.addEventListener("click", () => {
    if (groqKeyInput.type === "password") {
			groqKeyInput.type = "text";
			toggleBtn.textContent = "Hide";
		} else {
			groqKeyInput.type = "password";
			toggleBtn.textContent = "Show";
		}
  });


  // Save API key
  saveBtn.addEventListener("click", () => {
    const key = groqKeyInput.value.trim();
    chrome.storage.local.set({ GROQ_API_KEY: key }, () => {
      status.textContent = "✅ API key saved.";
      setTimeout(() => status.textContent = "", 2000);
    });
  });

  // Generate reply button
  generateBtn.addEventListener("click", () => {
		resultBox.innerHTML = "⏳ Checking API key...";
		
		chrome.storage.local.get("GROQ_API_KEY", async (data) => {
			const apiKey = data.GROQ_API_KEY?.trim();
			
			if (!apiKey) {
				resultBox.innerHTML = "⚠️ API key not found. Please save your Groq API key first.";
				return;
			}
			
			resultBox.innerHTML = "⏳ Generating replies...";
			chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
				if (!tab?.id) {
					resultBox.innerHTML = "⚠️ No active Gmail tab found.";
					return;
				}

				chrome.tabs.sendMessage(tab.id, { action: "getEmailBody" }, (response) => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError);
						resultBox.innerHTML = "⚠️ Could not connect to Gmail page. Make sure you're viewing an email.";
						return;
					}

					if (!response || !response.emailBody) {
						resultBox.innerHTML = "⚠️ Could not read email body. Please open an email thread in Gmail.";
						return;
					}

					// Now generate replies
					(async () => {
						try {
							const replies = await fetchAIResponse(response.emailBody);

							resultBox.innerHTML = "";
							replies.forEach(reply => {
								const replyPara = document.createElement("p");
								replyPara.textContent = reply;

								const copyBtn = document.createElement("button");
								copyBtn.textContent = "Copy";
								copyBtn.addEventListener("click", () => {
									copyTextToClipboard(reply);
								});

								resultBox.appendChild(replyPara);
								resultBox.appendChild(copyBtn);
								resultBox.appendChild(document.createElement("hr"));
							});
						} catch (err) {
							console.error(err);
							resultBox.innerHTML = "⚠️ AI error. Check console for details.";
						}
					})();
				});
			});
		});
	});


});

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert("✅ Reply copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
      alert("⚠️ Failed to copy to clipboard.");
    });
}

async function fetchAIResponse(emailBody) {
  const prompt = `
You are an AI email assistant. Based on the email below, generate exactly 3 concise, professional, and polite reply options.

Each reply should:
- Be written as a full email (not just phrases)
- Be clearly numbered (1., 2., 3.)
- Do NOT use markdown, bold, italics, or quotation marks
- Do NOT include any explanation or commentary
- Do NOT include the Subject

Email thread:
${emailBody}

Provide only the 3 email replies as output.
`;
  // Fetch Groq API key from Chrome storage
  const { GROQ_API_KEY } = await new Promise(resolve => {
    chrome.storage.local.get(["GROQ_API_KEY"], resolve);
  });

  const providers = [
    {
      name: "groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama3-8b-8192",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY || ""}`,
        "Content-Type": "application/json"
      }
    },
    {
      name: "groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama3-70b-8192",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY || ""}`,
        "Content-Type": "application/json"
      }
    },
    {
      name: "groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY || ""}`,
        "Content-Type": "application/json"
      }
    }
  ];

  for (const provider of providers) {
    const payload = {
      model: provider.model,
      messages: [
        { role: "system", content: "You help users write concise, professional email replies." },
        { role: "user", content: prompt }
      ]
    };

    try {
      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: provider.headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      console.log(`Tried ${provider.name} model: ${provider.model}`);
      console.log(result);

      const content = result?.choices?.[0]?.message?.content;
      if (!content) continue;

      const suggestions = content
        .split(/\n(?=\d+\.\s+)/)
        .map(s => s
          .replace(/^\d+\.\s*/, '')
          .replace(/^\*\*(.*?)\*\*:?\s*/, '')
          .trim()
        )
        .filter(line => line.length > 0 && line.length < 800);

      if (suggestions.length > 0) {
        return suggestions.slice(0, 3);
      }

    } catch (err) {
      console.error(`Error from ${provider.name} (${provider.model}): ${err.message}`);
    }
  }

  return ["⚠️ AI model limit reached. Please try again later"];
}