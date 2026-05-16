import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal Web Speech API typings. The spec is non-standard so these are not
// in lib.dom. We type only what we use.

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const getSpeechRecognitionCtor = ():
  | SpeechRecognitionConstructor
  | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
};

export const isSpeechCaptureSupported = (): boolean =>
  Boolean(getSpeechRecognitionCtor());

export type SpeechCaptureStatus = 'idle' | 'listening' | 'error' | 'unsupported';

export interface UseSpeechCaptureOptions {
  onFinalText: (text: string) => void;
}

export interface UseSpeechCaptureResult {
  status: SpeechCaptureStatus;
  errorMessage: string | null;
  start: () => void;
  stop: () => void;
  supported: boolean;
}

export const useSpeechCapture = ({
  onFinalText,
}: UseSpeechCaptureOptions): UseSpeechCaptureResult => {
  const [supported] = useState<boolean>(isSpeechCaptureSupported);
  const [status, setStatus] = useState<SpeechCaptureStatus>(() =>
    supported ? 'idle' : 'unsupported'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onFinalTextRef = useRef(onFinalText);

  useEffect(() => {
    onFinalTextRef.current = onFinalText;
  }, [onFinalText]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setStatus('unsupported');
      return;
    }
    if (recognitionRef.current) return;

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang =
      (typeof navigator !== 'undefined' && navigator.language) || 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0]?.transcript ?? '';
        }
      }
      const trimmed = finalText.trim();
      if (trimmed) {
        onFinalTextRef.current(trimmed);
      }
    };

    recognition.onerror = (event) => {
      const friendly =
        event.error === 'not-allowed'
          ? 'Microphone permission was denied.'
          : event.error === 'no-speech'
          ? "Didn’t catch that."
          : event.error === 'audio-capture'
          ? 'No microphone found.'
          : event.error === 'aborted'
          ? null
          : 'Voice capture had a hiccup.';
      if (friendly) {
        setErrorMessage(friendly);
        setStatus('error');
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setStatus((current) => (current === 'error' ? current : 'idle'));
    };

    setErrorMessage(null);
    setStatus('listening');
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      // Some browsers throw if start is invoked too quickly after a stop.
      recognitionRef.current = null;
      setStatus('idle');
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
  }, []);

  return { status, errorMessage, start, stop, supported };
};
