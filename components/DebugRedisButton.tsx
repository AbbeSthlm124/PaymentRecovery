"use client";

/**
 * Temporary debug button - remove after diagnosing Redis issues
 */
export default function DebugRedisButton() {
  const testRedis = async () => {
    const res = await fetch("/api/debug-redis");
    const data = await res.json();
    console.log("Redis debug data:", data);
    alert("Check console for Redis debug info (F12 → Console)");
  };

  return (
    <button
      type="button"
      onClick={testRedis}
      className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-slate-700/80 text-xs text-slate-300 hover:bg-slate-600 border border-slate-600"
    >
      Test Redis
    </button>
  );
}
