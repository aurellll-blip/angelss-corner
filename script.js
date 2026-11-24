window.onload = function() {
  const savedTheme = localStorage.getItem('blogTheme');
  if (savedTheme) {
    document.body.className = savedTheme;
  }
};

// Ganti Tema
const themes = ['', 'theme-angel', 'theme-glam'];
let currentThemeIndex = 0;

function cycleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const selected = themes[currentThemeIndex];
  document.body.className = selected;
  localStorage.setItem('blogTheme', selected);
}

// Cermin Digital
let mirrorStream = null;

async function toggleMirror() {
  const video = document.getElementById('mirrorVideo');
  const placeholder = document.getElementById('mirrorPlaceholder');
  const btn = document.getElementById('toggleMirrorBtn');

  if (!mirrorStream) {
    try {
      mirrorStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      video.srcObject = mirrorStream;
      video.style.display = 'block';
      placeholder.style.display = 'none';
      btn.textContent = 'Tutup Cermin ✖️';
    } catch (err) {
      alert('Izin kamera ditolak atau perangkat tidak memiliki kamera.');
    }
  } else {
    mirrorStream.getTracks().forEach(track => track.stop());
    mirrorStream = null;
    video.style.display = 'none';
    placeholder.style.display = 'block';
    btn.textContent = 'Buka Cermin 🪞';
  }
}

// Preview Foto ID Pass
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('photoLabel').innerHTML = `<img src="${e.target.result}" alt="Traveler Photo">`;
    }
    reader.readAsDataURL(file);
  }
}

// Scroll ke Konten Utama
function scrollToContent() {
  const name = document.getElementById('inputName').value;
  if (name) {
    localStorage.setItem('travelerName', name);
  }
  document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
}

// Preview Foto Koran
function previewNewsPhoto(event, labelId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById(labelId).innerHTML = `<img src="${e.target.result}" alt="News Photo">`;
    }
    reader.readAsDataURL(file);
  }
}

/* ================= FITUR CONFESSIONS ================= */
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('notesList')) {
    renderNotes();
  }
});

function saveNote() {
  const input = document.getElementById('noteInput');
  const text = input.value.trim();
  
  if (!text) {
    alert('Tulis dulu ceritanya ya, Angel! 🎀');
    return;
  }

  const notes = JSON.parse(localStorage.getItem('girlNotes')) || [];
  notes.unshift({
    text: text,
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  localStorage.setItem('girlNotes', JSON.stringify(notes));
  input.value = '';
  renderNotes();
}

function renderNotes() {
  const list = document.getElementById('notesList');
  const notes = JSON.parse(localStorage.getItem('girlNotes')) || [];
  
  if (notes.length === 0) {
    list.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-color); font-size: 0.9rem; opacity: 0.8;">Belum ada catatan rahasia. Yuk, tulis cerita pertamamu di atas! ✨</p>`;
    return;
  }

  list.innerHTML = notes.map((n, index) => `
    <div class="note-mini-card" onclick="openNoteModal(${index})">
      <div>
        <small style="color: var(--deep-rose); font-weight: 500;">🗓️ ${n.date}</small>
        <p class="note-preview-text">${n.text}</p>
      </div>
      <div class="note-footer">
        <span>Baca selengkapnya ✨</span>
        <button onclick="deleteNote(event, ${index})" style="background:none; border:none; color:var(--deep-rose); cursor:pointer; font-size:0.75rem; font-weight:500;">Hapus</button>
      </div>
    </div>
  `).join('');
}

function openNoteModal(index) {
  const notes = JSON.parse(localStorage.getItem('girlNotes')) || [];
  const note = notes[index];
  if (!note) return;

  document.getElementById('modalNoteDate').textContent = `🗓️ Ditulis pada ${note.date}`;
  document.getElementById('modalNoteFullText').textContent = note.text;
  document.getElementById('noteReadModal').style.display = 'flex';
}

function closeNoteModal(event) {
  if (event.target.id === 'noteReadModal') {
    document.getElementById('noteReadModal').style.display = 'none';
  }
}

function deleteNote(event, index) {
  event.stopPropagation();
  const notes = JSON.parse(localStorage.getItem('girlNotes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('girlNotes', JSON.stringify(notes));
  renderNotes();
}