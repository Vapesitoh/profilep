// ===============================
// ✅ CONTADOR (Netlify Functions)
// ===============================
async function initVisitCounter() {
  const el = document.getElementById("visitCount");
  if (!el) return;

  try {
    // Cuenta por URL completa (como el ejemplo que te dieron)
    const pageUrl = window.location.href;

    const res = await fetch(
      `/.netlify/functions/page_view?page=${encodeURIComponent(pageUrl)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      // Si la function no existe (404) o error (500), no rompas la página
      console.error("Contador: HTTP", res.status);
      el.textContent = "—";
      return;
    }

    const data = await res.json();
    const count = data?.data?.view_count ?? 0;

    el.textContent = Number(count).toLocaleString("es-ES");
  } catch (err) {
    console.error("Contador error:", err);
    el.textContent = "—";
  }
}

// ===============================
// ✅ AUDIO PLAYER
// ===============================
const audio = document.getElementById("introAudio");
const playBtn = document.getElementById("playIntroBtn");
const muteBtn = document.getElementById("muteBtn");
const seekBar = document.getElementById("seekBar");
const currentTimeSpan = document.getElementById("currentTime");
const durationSpan = document.getElementById("duration");

let isPlaying = false;

function formatTime(sec) {
  if (!Number.isFinite(sec)) return "00:00";
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

// Click play/pause
if (playBtn && audio) {
  playBtn.onclick = async () => {
    try {
      if (!isPlaying) {
        await audio.play();
        isPlaying = true;
        playBtn.textContent = "⏸ Pausar música";
      } else {
        audio.pause();
        isPlaying = false;
        playBtn.textContent = "▶ Reproducir música";
      }
    } catch (e) {
      console.error("Audio play error:", e);
    }
  };
}

// Mute/unmute
if (muteBtn && audio) {
  muteBtn.onclick = () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔇" : "🔈";
  };
}

// Metadata loaded
if (audio && durationSpan) {
  audio.onloadedmetadata = () => {
    durationSpan.textContent = formatTime(audio.duration);
  };
}

// Update timeline
if (audio && seekBar && currentTimeSpan) {
  audio.ontimeupdate = () => {
    const dur = audio.duration || 0;
    seekBar.value = dur ? (audio.currentTime / dur) * 100 : 0;
    currentTimeSpan.textContent = formatTime(audio.currentTime);
  };
}

// Scrub seekbar
if (audio && seekBar) {
  seekBar.oninput = () => {
    const dur = audio.duration || 0;
    audio.currentTime = (seekBar.value / 100) * dur;
  };
}

// Ended
if (audio && playBtn) {
  audio.onended = () => {
    isPlaying = false;
    playBtn.textContent = "▶ Reproducir música";
  };
}

// ===============================
// ✅ DISCORD COPY
// ===============================
const discordBtn = document.getElementById("discordBtn");
if (discordBtn) {
  discordBtn.onclick = async () => {
    const user = "vapesitoh";
    try {
      await navigator.clipboard.writeText(user);

      discordBtn.classList.add("copied");

      // Guardamos el texto original para restaurarlo bien
      const originalHTML = discordBtn.innerHTML;

      // Cambia temporalmente (no uses textContent si tu botón tiene iconos)
      discordBtn.innerHTML = "✓ Copiado";

      setTimeout(() => {
        discordBtn.classList.remove("copied");
        discordBtn.innerHTML = originalHTML;
      }, 1500);
    } catch (e) {
      console.error("Clipboard error:", e);
    }
  };
}

// ===============================
// ✅ INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initVisitCounter();
});
