import type { SVGProps } from "react";

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.78-.07-1.53-.2-2.27H12v4.32h6.47a5.5 5.5 0 0 1-2.38 3.61v3h3.84c2.25-2.07 3.56-5.11 3.56-8.66z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.84-3a7.3 7.3 0 0 1-4.11 1.18c-3.16 0-5.84-2.13-6.79-5h-4v3.14A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.21 14.27a7.2 7.2 0 0 1 0-4.54V6.59H1.2a12 12 0 0 0 0 10.82l4-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75a6.52 6.52 0 0 1 4.61 1.8l3.44-3.44A11.56 11.56 0 0 0 12 0a12 12 0 0 0-10.8 6.59l4 3.14C6.16 6.88 8.84 4.75 12 4.75z"
      />
      <path fill="none" d="M0 0h24v24H0z" />
    </svg>
  );
}
