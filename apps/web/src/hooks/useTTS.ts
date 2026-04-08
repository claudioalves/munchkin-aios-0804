import { useCallback, useEffect, useState } from 'react';

const VOICE_KEY = 'munchkin-tts-voice';

export function useTTS() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [voices, setVoices] = useState<globalThis.SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURIState] = useState<string>(
    () => localStorage.getItem(VOICE_KEY) ?? '',
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isSupported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [isSupported]);

  const setVoice = useCallback((uri: string) => {
    setSelectedVoiceURIState(uri);
    localStorage.setItem(VOICE_KEY, uri);
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    if (selectedVoiceURI) {
      const voice = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices, selectedVoiceURI]);

  return { isSupported, voices, selectedVoiceURI, setVoice, speak, stop, isSpeaking };
}
