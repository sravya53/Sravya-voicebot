/* Voice assistant script - no API key required
   Personalized for Sravya (Andhra Pradesh, B.Tech - Bharath University, Chennai)
*/

const micButton = document.getElementById("micButton");
const responseBox = document.getElementById("responseBox");

let recognition = null;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
} else {
  console.warn("SpeechRecognition not supported in this browser.");
  micButton.style.display = "none";
}

micButton.addEventListener("click", () => {
  if (!recognition) return;
  responseBox.innerHTML = "<i>Listening...</i>";
  micButton.classList.add("listening");
  recognition.start();
});

if (recognition) {
  recognition.onend = () => {
    micButton.classList.remove("listening");
  };
  recognition.onresult = function (e) {
    const text = e.results[0][0].transcript.toLowerCase();
    processInput(text);
  };
  recognition.onerror = function (e) {
    micButton.classList.remove("listening");
    console.error("Recognition error:", e);
    responseBox.innerHTML = "<i>Could not understand — try again or click a question.</i>";
  };
}

const intents = {
  life_story: {
    patterns: [
      "life story", "tell me about yourself", "introduce yourself",
      "who are you", "background", "where are you from", "your story"
    ],
    reply: "I'm Sravya from Andhra Pradesh. I'm currently pursuing B.Tech at Bharath University in Chennai. I'm passionate about learning and growing, especially in technical areas."
  },

  superpower: {
    patterns: [
      "superpower", "strength", "best quality", "what are you good at", "biggest strength", "your power"
    ],
    reply: "My #1 superpower is being hardworking and creative. I also show leadership and I'm a quick learner."
  },

  growth: {
    patterns: [
      "grow", "improve", "growth areas", "areas you'd like to grow", "what do you want to improve"
    ],
    reply: "The top three areas I want to grow in are: technical skills, communication, and leadership."
  },

  misconception: {
    patterns: [
      "misconception", "people think", "coworkers think", "misunderstand", "what do people think"
    ],
    reply: "A common misconception is that I overthink and seem introverted. While I might appear quiet, I am observant and thoughtful."
  },

  limits: {
    patterns: [
      "push your boundaries", "limits", "challenge yourself", "push yourself", "how do you push"
    ],
    reply: "I push my boundaries by taking on new challenges and staying consistent in learning and practice."
  },

  strengths: {
    patterns: [
      "strengths", "what are your strengths", "your strengths"
    ],
    reply: "My strengths include hardworking attitude, creativity, leadership, and quick learning."
  },

  weaknesses: {
    patterns: [
      "weakness", "what is your weakness", "your weakness"
    ],
    reply: "I can be an overthinker and sometimes come across as introverted while I process things carefully."
  },

  fallback: {
    reply: "I didn't fully understand that — try one of the listed questions or click a button."
  }
};

document.querySelectorAll(".qbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const q = btn.innerText.toLowerCase();
    processInput(q);
  });
});

function processInput(input) {
  input = input.toLowerCase();
  for (let key in intents) {
    if (key === "fallback") continue;
    for (let phrase of intents[key].patterns) {
      if (input.includes(phrase)) {
        const reply = intents[key].reply;
        displayAndSpeak(reply, input);
        return;
      }
    }
  }
  displayAndSpeak(intents.fallback.reply, input);
}

function displayAndSpeak(reply, question) {
  responseBox.innerHTML = `<b>You:</b> ${escapeHtml(question)}<br><br><b>Sravya:</b> ${escapeHtml(reply)}`;
  speak(reply);
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-IN";
  utt.rate = 1;
  const voices = window.speechSynthesis.getVoices();
  for (let v of voices) {
    if (v.lang && v.lang.toLowerCase().includes("en-in")) {
      utt.voice = v;
      break;
    }
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
