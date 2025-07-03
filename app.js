const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert('Speech Recognition not supported');
    throw new Error('Unsupported browser');
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-IN';

let isRecording = false;
let allText = "";  // Accumulates everything spoken so far

const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const output = document.getElementById('output');

startBtn.addEventListener('click', () => {
    recognition.start();
    isRecording = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    isRecording = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

recognition.addEventListener('result', (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            allText += transcript + " ";            // Append final transcript
        } else {
            interim += transcript;                 // Show live interim text
        }
    }
    // Display all recorded speech + live interim
    output.innerHTML = `<span>${allText}</span><em style="color: #e1bee7;">${interim}</em>`;
});

recognition.addEventListener('end', () => {
    if (isRecording) recognition.start();    // Auto-restart on silence
});

recognition.addEventListener('error', (e) => {
    console.error('Recognition error:', e);
    output.textContent = `Error: ${e.error}`;
    if (isRecording && e.error !== 'not-allowed') recognition.start();
});
