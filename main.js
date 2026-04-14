// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.toggle('dark-mode', savedTheme === 'dark');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Teachable Machine Integration
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/CVkszXzkx/";
let model, webcam, maxPredictions;

async function initModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// UI Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const resultSection = document.getElementById('result-section');
const imagePreview = document.getElementById('image-preview');
const loadingOverlay = document.getElementById('loading-overlay');
const dogProgress = document.getElementById('dog-progress');
const catProgress = document.getElementById('cat-progress');
const dogPercent = document.getElementById('dog-percent');
const catPercent = document.getElementById('cat-percent');
const finalVerdict = document.getElementById('final-verdict');
const funFact = document.getElementById('fun-fact');
const retryBtn = document.getElementById('retry-btn');
const uploadSection = document.querySelector('.upload-section');
const webcamBtn = document.getElementById('webcam-btn');
const webcamContainer = document.getElementById('webcam-container');
const webcamWrapper = document.getElementById('webcam-wrapper');
const captureBtn = document.getElementById('capture-btn');

// Event Listeners for Upload
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--secondary-color)';
    uploadArea.style.transform = 'scale(1.02)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.transform = 'scale(1)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.transform = 'scale(1)';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImage(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImage(e.target.files[0]);
    }
});

// Webcam Logic
webcamBtn.addEventListener('click', async () => {
    webcamBtn.classList.add('hidden');
    webcamContainer.classList.remove('hidden');
    
    if (!model) await initModel();
    
    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);
    
    webcamWrapper.appendChild(webcam.canvas);
});

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

captureBtn.addEventListener('click', async () => {
    const canvas = webcam.canvas;
    const dataUrl = canvas.toDataURL('image/png');
    
    // Stop webcam
    if (webcam) {
        webcam.stop();
        webcamWrapper.innerHTML = '';
        webcamContainer.classList.add('hidden');
        webcamBtn.classList.remove('hidden');
    }
    
    imagePreview.src = dataUrl;
    uploadSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    loadingOverlay.classList.remove('hidden');
    
    await predict(canvas);
});

retryBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    fileInput.value = '';
    resetResults();
});

function resetResults() {
    dogProgress.style.width = '0%';
    catProgress.style.width = '0%';
    dogPercent.textContent = '0%';
    catPercent.textContent = '0%';
    finalVerdict.textContent = '당신의 동물상을 분석 중입니다...';
    funFact.textContent = '';
}

async function handleImage(file) {
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일을 업로드해주세요!');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        imagePreview.src = e.target.result;
        uploadSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        loadingOverlay.classList.remove('hidden');

        if (!model) {
            await initModel();
        }

        predict(imagePreview);
    };
    reader.readAsDataURL(file);
}

async function predict(inputElement) {
    const prediction = await model.predict(inputElement);
    loadingOverlay.classList.add('hidden');

    let dogScore = 0;
    let catScore = 0;

    prediction.forEach(p => {
        const name = p.className.toLowerCase();
        if (name === 'dog' || name.includes('강아지')) {
            dogScore = p.probability;
        } else if (name === 'cat' || name.includes('고양이')) {
            catScore = p.probability;
        }
    });

    // Update UI with scores
    updateScore('dog', dogScore);
    updateScore('cat', catScore);

    // Final Verdict
    if (dogScore > catScore) {
        finalVerdict.textContent = "당신은 강아지상입니다! 🐶";
        funFact.textContent = "강아지상은 충성심이 강하고 에너지가 넘치며 다정한 성격으로 알려져 있습니다. 당신의 따뜻한 미소는 주변 사람들의 기분을 환하게 만들어 줄 거예요!";
    } else if (catScore > dogScore) {
        finalVerdict.textContent = "당신은 고양이상입니다! 🐱";
        funFact.textContent = "고양이상은 신비롭고 독립적이며 우아한 매력을 가지고 있습니다. 날카로우면서도 세련된 외모와 차분하고 침착한 성격의 소유자일 확률이 높아요!";
    } else {
        finalVerdict.textContent = "신비로운 혼합형입니다! 🐾";
        funFact.textContent = "강아지와 고양이의 매력을 모두 갖춘 당신은 정말 특별한 존재네요!";
    }
}

function updateScore(animal, score) {
    const percent = Math.round(score * 100);
    const progressFill = document.getElementById(`${animal}-progress`);
    const percentText = document.getElementById(`${animal}-percent`);
    
    setTimeout(() => {
        progressFill.style.width = `${percent}%`;
        percentText.textContent = `${percent}%`;
    }, 100);
}
