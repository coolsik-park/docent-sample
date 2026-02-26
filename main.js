import './style.css';

// Sample Transcript Data with timestamps (in seconds)
const transcriptData = [
    { start: 0, end: 4, text: "오디오 도슨트 투어에 오신 것을 환영합니다." },
    { start: 4, end: 11, text: "지금 여러분 앞에 있는 작품은 빈센트 반 고흐의 가장 유명한 걸작, '별이 빛나는 밤'입니다." },
    { start: 11, end: 18, text: "1889년 6월에 그려진 이 그림은, 생레미 요양원 그의 방 동쪽 창문에서 바라본 풍경을 묘사하고 있습니다." },
    { start: 18, end: 26, text: "소용돌이치며 격렬하게 움직이는 하늘을 주목해 보세요. 이는 작가의 깊은 내면과 혼란스러운 감정을 생생하게 반영합니다." },
    { start: 26, end: 34, text: "별과 초승달의 강렬하고 생동감 넘치는 노란색은, 밤하늘의 깊고 우울한 푸른빛과 예리한 대조를 이룹니다." },
    { start: 34, end: 41, text: "언덕 아래에는 조용한 마을이 자리 잡고 있습니다. 마을을 압도하듯 솟아오른 교회 첨탑은 요동치는 하늘에 맞서 안정감을 더해줍니다." },
    { start: 41, end: 51, text: "고흐는 동생 테오에게 이렇게 편지를 썼습니다. '오늘 아침 해가 뜨기 한참 전, 아주 커다랗게 빛나는 샛별 외에는 아무것도 없는 창밖의 시골 풍경을 보았다.'" },
    { start: 51, end: 60, text: "이 작품은 단순한 풍경화가 아닙니다. 그것은 깊은 영혼의 고독이자, 빛나는 별들 속에서 찾아낸 꺼지지 않는 희망의 표현입니다." }
];

// Pointing to the locally generated Korean TTS .wav file
const SAMPLE_AUDIO_URL = "/docent-audio.wav";

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-source');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const transcriptContainer = document.getElementById('transcript-content');
    const heroImage = document.getElementById('artwork-img');

    // Load audio source
    audio.src = SAMPLE_AUDIO_URL;

    // Initialize Transcript UI
    transcriptData.forEach((item, index) => {
        const span = document.createElement('span');
        span.className = 'transcript-sentence';
        span.dataset.start = item.start;
        span.dataset.end = item.end;
        span.dataset.index = index;
        span.textContent = item.text + " ";

        // Make text clickable to jump to time
        span.addEventListener('click', () => {
            audio.currentTime = item.start;
            if (audio.paused) {
                togglePlayPause();
            }
        });

        transcriptContainer.appendChild(span);
    });

    const sentences = document.querySelectorAll('.transcript-sentence');

    // Format time in M:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    // Play/Pause audio
    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
            heroImage.classList.add('playing');
        } else {
            audio.pause();
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
            heroImage.classList.remove('playing');
        }
    }

    playPauseBtn.addEventListener('click', togglePlayPause);

    // Update progress and timer
    audio.addEventListener('timeupdate', () => {
        // Update progress bar
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent;

            // Update background size to show fill (since range input standard styling lacks fill track across browsers)
            progressBar.style.background = `linear-gradient(to right, var(--accent-gold) ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%)`;
        }

        // Update timers
        currentTimeEl.textContent = formatTime(audio.currentTime);

        // Sync transcript highlights
        const currentAdjustedTime = audio.currentTime;

        sentences.forEach((sentence) => {
            const start = parseFloat(sentence.dataset.start);
            const end = parseFloat(sentence.dataset.end);

            if (currentAdjustedTime >= start && currentAdjustedTime < end) {
                sentence.classList.add('active');
                // Optional: Auto-scroll
                // sentence.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                sentence.classList.remove('active');
            }
        });
    });

    // Calculate duration once metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        durationTimeEl.textContent = formatTime(audio.duration);
    });

    // Handle manual seek
    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    // Handle end of audio
    audio.addEventListener('ended', () => {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        heroImage.classList.remove('playing');
        progressBar.value = 0;
        progressBar.style.background = `rgba(255, 255, 255, 0.2)`;
        currentTimeEl.textContent = formatTime(0);
        sentences.forEach(s => s.classList.remove('active'));
    });

});
