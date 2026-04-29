import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { loginWithGoogle } from '@/lib/api';
import { setSession } from '@/lib/auth';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity]');
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services.'));
    document.body.appendChild(script);
  });
}

export function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.cancel?.();
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          auto_select: false,
          callback: async ({ credential }) => {
            if (!credential) {
              toast.error('Google did not return a valid credential.');
              return;
            }

            setIsSubmitting(true);
            try {
              const session = await loginWithGoogle(credential);
              setSession(session.accessToken, session.user);
              toast.success('Google login successful.');
              onSuccess?.();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Google login failed. Check that frontend and backend use the same Google client ID.',
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        });

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 230,
        });
        setIsReady(true);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Unable to load Google sign-in.');
      });

    return () => {
      cancelled = true;
      window.google?.accounts?.id?.cancel?.();
    };
  }, [onSuccess]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 px-4 py-3 text-center text-xs text-slate-500">
        Set `VITE_GOOGLE_CLIENT_ID` to enable Google login.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={buttonRef} className={!isReady ? 'min-h-10' : undefined} />
      {isSubmitting && <p className="text-xs text-slate-500">Signing in with Google...</p>}
    </div>
  );
}
