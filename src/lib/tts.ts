export function speakChinese(text: string, rate = 1) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ??
    voices.find((v) => v.lang.toLowerCase().includes("chinese"));
  if (zhVoice) utterance.voice = zhVoice;

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
