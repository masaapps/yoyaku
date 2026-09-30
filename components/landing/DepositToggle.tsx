"use client";

import { useState } from "react";

export default function DepositToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="rounded-2xl bg-green-50 p-4">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-800"
      >
        <span className="text-sm font-bold text-green-900">予約金を受け取る</span>
        <span
          aria-hidden="true"
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
            enabled ? "bg-green-800" : "bg-green-200"
          }`}
        >
          <span
            className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 motion-reduce:transition-none ${
              enabled ? "translate-x-5" : ""
            }`}
          />
        </span>
      </button>

      <p className="mt-3 text-sm leading-6 text-green-900" aria-live="polite">
        {enabled
          ? "予約時にカードで予約金をお預かりします。当日の無断キャンセルが起きても、売上がゼロになりません。"
          : "今まで通り、お代はすべて来店時にお店でお支払い。設定を変えなければこのままです。"}
      </p>
    </div>
  );
}
