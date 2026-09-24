import { useEffect, useState } from "react";

export function Splash() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("l449.splash")) return;
    setVisible(true);
    const t1 = setTimeout(() => setFading(true), 700);
    const t2 = setTimeout(() => {
      setVisible(false);
      window.sessionStorage.setItem("l449.splash", "1");
    }, 1050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-bg transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <img
          src="/app-icon-192.png"
          alt="Ícone do app Estaca GPS"
          width={80}
          height={80}
          className="mx-auto h-20 w-20 rounded-2xl"
        />
        <div className="mt-4 font-display text-2xl font-semibold tracking-tight text-fg">Estaca GPS</div>
        <div className="text-xs uppercase tracking-widest text-muted">L449 · São Joaquim</div>
      </div>
    </div>
  );
}
