// Ljudhantering
let audioContext, merger, masterGain, time = 0;
const activeOscillators = new Map();

function setupAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    merger = audioContext.createChannelMerger(2);
    masterGain = audioContext.createGain();
    masterGain.gain.value = volume;
    merger.connect(masterGain);
    masterGain.connect(audioContext.destination);
  }
}

function startTone(frequency, pan = 0) {
  setupAudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panner = audioContext.createStereoPanner();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(panner);
  panner.pan.setValueAtTime(pan, audioContext.currentTime);
  panner.connect(merger);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
  oscillator.start();
  activeOscillators.set(frequency, { oscillator, gain: gainNode });
  currentFreq = frequency;
  updateFrequencyDisplay(frequency);
}

function stopTone(frequency) {
  const { oscillator, gain } = activeOscillators.get(frequency) || {};
  if (oscillator && gain) {
    gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    oscillator.stop(audioContext.currentTime + 0.1);
    oscillator.onended = () => activeOscillators.delete(frequency);
  }
  if (activeOscillators.size === 0) currentFreq = 0;
  updateFrequencyDisplay(currentFreq);
}

// Ytterligare JavaScript-kod här
