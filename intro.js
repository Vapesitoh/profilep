// ===============================
// ✅ CONTADOR (Netlify Functions)
// ===============================
async function initVisitCounter() {
  const el = document.getElementById("visitCount");
  if (!el) return;

  try {
    // Cuenta por URL completa
    const pageUrl = window.location.href;

    const res = await fetch(
      `/.netlify/functions/page_view?page=${encodeURIComponent(pageUrl)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
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
function initAudioPlayer() {
  const audio = document.getElementById("introAudio");
  const playBtn = document.getElementById("playIntroBtn");
  const muteBtn = document.getElementById("muteBtn");
  const seekBar = document.getElementById("seekBar");
  const currentTimeSpan = document.getElementById("currentTime");
  const durationSpan = document.getElementById("duration");

  if (!audio) return;

  let isPlaying = false;

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m}:${s}`;
  }

  // Play / Pause
  if (playBtn) {
    playBtn.addEventListener("click", async () => {
      try {
        if (!isPlaying) {
          await audio.play(); // puede fallar por autoplay policy si no hay interacción
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
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? "🔇" : "🔈";
    });
  }

  // Duration
  if (durationSpan) {
    audio.addEventListener("loadedmetadata", () => {
      durationSpan.textContent = formatTime(audio.duration);
    });
  }

  // Timeline update
  if (seekBar && currentTimeSpan) {
    audio.addEventListener("timeupdate", () => {
      const dur = Number.isFinite(audio.duration) ? audio.duration : 0;
      seekBar.value = dur ? (audio.currentTime / dur) * 100 : 0;
      currentTimeSpan.textContent = formatTime(audio.currentTime);
    });

    // Seek
    seekBar.addEventListener("input", () => {
      const dur = Number.isFinite(audio.duration) ? audio.duration : 0;
      if (!dur) return;
      audio.currentTime = (Number(seekBar.value) / 100) * dur;
    });
  }

  // Ended
  if (playBtn) {
    audio.addEventListener("ended", () => {
      isPlaying = false;
      playBtn.textContent = "▶ Reproducir música";
    });
  }
}

// ===============================
// ✅ DISCORD COPY
// ===============================
function initDiscordCopy() {
  const discordBtn = document.getElementById("discordBtn");
  if (!discordBtn) return;

  discordBtn.addEventListener("click", async () => {
    const user = "vapesitoh";

    try {
      // Si no hay permisos, fallback más abajo
      await navigator.clipboard.writeText(user);

      discordBtn.classList.add("copied");
      const originalHTML = discordBtn.innerHTML;
      discordBtn.innerHTML = "✓ Copiado";

      setTimeout(() => {
        discordBtn.classList.remove("copied");
        discordBtn.innerHTML = originalHTML;
      }, 1500);
    } catch (e) {
      console.error("Clipboard error:", e);

      // Fallback: selecciona texto (para browsers que bloquean clipboard)
      try {
        const tmp = document.createElement("input");
        tmp.value = user;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
      } catch (e2) {
        console.error("Clipboard fallback failed:", e2);
      }
    }
  });
}

// ===============================
// 🎨 FLOAT THEME SWITCHER (SIN GUARDAR)
// ===============================
function initThemeSwitcher() {
  const fab = document.getElementById("themeFab");
  const pop = document.getElementById("themePop");

  const THEMES = ["glass", "blue", "city", "mono"];
  const STYLES = ["soft", "outline", "compact"];

  function applyTheme(name) {
    THEMES.forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${name}`);
    markActive("[data-theme]", name, "theme");
  }

  function applyStyle(name) {
    STYLES.forEach(s => document.body.classList.remove(`style-${s}`));
    document.body.classList.add(`style-${name}`);
    markActive("[data-style]", name, "style");
  }

  function markActive(selector, value, key) {
    document.querySelectorAll(selector).forEach(btn => {
      const v = btn.dataset[key];
      btn.classList.toggle("active", v === value);
    });
  }

  // Defaults (NO localStorage)
  applyTheme("glass");
  applyStyle("soft");

  // Si no existe el popover, no intentes abrirlo
  if (fab && pop) {
    const togglePop = () => pop.classList.toggle("open");
    const closePop = () => pop.classList.remove("open");

    fab.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePop();
    });

    pop.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => closePop());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePop();
    });
  }

  // Botones
  document.querySelectorAll("[data-theme]").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  document.querySelectorAll("[data-style]").forEach(btn => {
    btn.addEventListener("click", () => applyStyle(btn.dataset.style));
  });
}

// ===============================
// ✅ INIT (UNO SOLO)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initVisitCounter();
  initAudioPlayer();
  initDiscordCopy();
  initThemeSwitcher();
});
