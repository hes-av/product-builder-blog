// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Teachable Machine Integration
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/CVkszXzkx/";
let model, webcam, maxPredictions;

async function initModel() {
    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("Model loading failed:", error);
        alert("AI 모델을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
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
const shareBtn = document.getElementById('share-btn');
const uploadSection = document.querySelector('.upload-section');
const webcamBtn = document.getElementById('webcam-btn');
const webcamContainer = document.getElementById('webcam-container');
const webcamWrapper = document.getElementById('webcam-wrapper');
const captureBtn = document.getElementById('capture-btn');

// Event Listeners for Upload
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
    uploadArea.style.transform = 'translateY(-5px)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--shadow-color)';
    uploadArea.style.transform = 'translateY(0)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--shadow-color)';
    uploadArea.style.transform = 'translateY(0)';
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
    try {
        webcamBtn.classList.add('hidden');
        webcamContainer.classList.remove('hidden');
        
        if (!model) await initModel();
        
        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);
        
        webcamWrapper.innerHTML = '';
        webcamWrapper.appendChild(webcam.canvas);
    } catch (error) {
        console.error("Webcam error:", error);
        alert("카메라를 시작할 수 없습니다. 권한 설정을 확인해주세요.");
        webcamBtn.classList.remove('hidden');
        webcamContainer.classList.add('hidden');
    }
});

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        window.requestAnimationFrame(loop);
    }
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
    window.scrollTo({ top: uploadSection.offsetTop - 100, behavior: 'smooth' });
});

// Share Logic
shareBtn.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'AI 동물상 테스트',
            text: `나의 동물상은 ${finalVerdict.textContent}입니다! 지금 확인해보세요.`,
            url: window.location.href,
        }).catch(console.error);
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('주소가 복사되었습니다! 친구들에게 공유해보세요.');
    }
});

function resetResults() {
    dogProgress.style.width = '0%';
    catProgress.style.width = '0%';
    dogPercent.textContent = '0%';
    catPercent.textContent = '0%';
    finalVerdict.textContent = '분석 중...';
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
    try {
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

        // Final Verdict with detailed text for SEO and value
        if (dogScore > catScore) {
            finalVerdict.textContent = "다정한 매력의 강아지상! 🐶";
            funFact.textContent = "축하합니다! 당신은 전형적인 '강아지상'입니다. 강아지상은 전체적으로 선하고 둥글둥글한 인상을 주며, 사람들에게 깊은 신뢰감과 친근함을 주는 것이 특징입니다. 인공지능 분석 결과, 당신의 눈매와 입매에서 따뜻한 에너지가 느껴집니다. 사교적이고 밝은 성격의 소유자일 확률이 높으며, 주변 사람들을 행복하게 만드는 마법 같은 매력을 가지고 계시네요!";
        } else if (catScore > dogScore) {
            finalVerdict.textContent = "시크한 매력의 고양이상! 🐱";
            funFact.textContent = "축하합니다! 당신은 매력적인 '고양이상'입니다. 고양이상은 도도하면서도 세련된 인상을 주며, 신비로운 분위기를 자아내는 것이 특징입니다. 인공지능 분석 결과, 당신의 날렵한 콧날과 살짝 올라간 눈매가 매우 매력적으로 인식되었습니다. 독립심이 강하고 자기주관이 뚜렷하며, 알면 알수록 더 궁금해지는 마성의 매력을 소유하고 계시군요!";
        } else {
            finalVerdict.textContent = "신비로운 조화의 혼합형! 🐾";
            funFact.textContent = "정말 특별한 결과입니다! 강아지상의 다정함과 고양이상의 세련됨을 모두 갖춘 매력적인 얼굴이시네요. 상황에 따라 다양한 분위기를 연출할 수 있는 팔색조 같은 매력을 지니고 있습니다.";
        }
    } catch (error) {
        console.error("Prediction error:", error);
        alert("분석 중 오류가 발생했습니다.");
        retryBtn.click();
    }
}

function updateScore(animal, score) {
    const percent = Math.round(score * 100);
    const progressFill = document.getElementById(`${animal}-progress`);
    const percentText = document.getElementById(`${animal}-percent`);
    
    if (progressFill && percentText) {
        setTimeout(() => {
            progressFill.style.width = `${percent}%`;
            percentText.textContent = `${percent}%`;
        }, 100);
    }
}
