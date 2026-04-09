import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTTS } from '@/hooks/useTTS';

const makeMockSynth = () => ({
  getVoices: vi.fn().mockReturnValue([]),
  cancel: vi.fn(),
  speak: vi.fn(),
  speaking: false,
  onvoiceschanged: null as null | (() => void),
});

beforeEach(() => {
  (global as unknown as Record<string, unknown>).SpeechSynthesisUtterance = vi.fn().mockImplementation(
    (text: string) => ({ text, voice: null, lang: 'pt-BR', onstart: null, onend: null, onerror: null }),
  );
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  // Limpar speechSynthesis se foi adicionado
  if ('speechSynthesis' in window) {
    Reflect.deleteProperty(window, 'speechSynthesis');
  }
});

describe('useTTS', () => {
  it('isSupported é false quando speechSynthesis não está no window', () => {
    // jsdom não implementa speechSynthesis por padrão
    const { result } = renderHook(() => useTTS());
    expect(result.current.isSupported).toBe(false);
  });

  it('isSupported é true quando speechSynthesis está disponível', () => {
    const mockSynth = makeMockSynth();
    Object.defineProperty(window, 'speechSynthesis', { value: mockSynth, configurable: true, writable: true });

    const { result, unmount } = renderHook(() => useTTS());
    expect(result.current.isSupported).toBe(true);
    unmount(); // cleanup roda antes de remover speechSynthesis
  });

  it('speak chama speechSynthesis.speak com utterance', () => {
    const mockSynth = makeMockSynth();
    Object.defineProperty(window, 'speechSynthesis', { value: mockSynth, configurable: true, writable: true });

    const { result, unmount } = renderHook(() => useTTS());
    act(() => {
      result.current.speak('Teste de narração');
    });

    expect(mockSynth.speak).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('stop chama speechSynthesis.cancel', () => {
    const mockSynth = makeMockSynth();
    Object.defineProperty(window, 'speechSynthesis', { value: mockSynth, configurable: true, writable: true });

    const { result, unmount } = renderHook(() => useTTS());
    act(() => {
      result.current.stop();
    });

    expect(mockSynth.cancel).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('setVoice persiste a URI no localStorage', () => {
    const mockSynth = makeMockSynth();
    Object.defineProperty(window, 'speechSynthesis', { value: mockSynth, configurable: true, writable: true });

    const { result, unmount } = renderHook(() => useTTS());
    act(() => {
      result.current.setVoice('pt-BR-voice-1');
    });

    expect(localStorage.getItem('munchkin-tts-voice')).toBe('pt-BR-voice-1');
    expect(result.current.selectedVoiceURI).toBe('pt-BR-voice-1');
    unmount();
  });
});
