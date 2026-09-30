import Link from "next/link";

import MobileFrame from "@/components/layout/MobileFrame";
import Button from "@/components/ui/Button";
import DepositToggle from "@/components/landing/DepositToggle";

type Channel = "phone" | "whatsapp" | "app";

const channelStyles: Record<Channel, { label: string; className: string }> = {
  phone: { label: "電話", className: "bg-green-800 text-white" },
  whatsapp: { label: "WhatsApp", className: "bg-[#1f7a4d] text-white" },
  app: { label: "アプリ", className: "bg-mustard-300 text-green-900" },
};

const todaysBookings: {
  time: string;
  menu?: string;
  channel?: Channel;
  deposit?: boolean;
}[] = [
  { time: "10:00", menu: "全身マッサージ 60分", channel: "phone" },
  { time: "11:30", menu: "フットマッサージ 30分", channel: "whatsapp" },
  { time: "13:00" },
  { time: "14:00", menu: "全身+フット 90分", channel: "app", deposit: true },
  { time: "16:00" },
];

const channels: { channel: Channel; body: string }[] = [
  {
    channel: "phone",
    body: "いつも通り電話で受けて、その場で空き枠に入れるだけ。",
  },
  {
    channel: "whatsapp",
    body: "メッセージで届いた予約も、同じ予約表にまとめられます。",
  },
  {
    channel: "app",
    body: "お客様が空き時間を見て、そのまま予約を確定できます。",
  },
];

const settings = [
  { name: "メニューと料金", detail: "施術メニューの追加や値段の変更" },
  { name: "スタッフの出勤表", detail: "誰がいつ入っているか" },
  { name: "営業時間と休業日", detail: "臨時休業もその日のうちに反映" },
];

const languages = [
  { name: "日本語", lang: "ja" },
  { name: "English", lang: "en" },
  { name: "中文", lang: "zh" },
  { name: "한국어", lang: "ko" },
  { name: "Deutsch", lang: "de" },
  { name: "Nederlands", lang: "nl" },
  { name: "Français", lang: "fr" },
  { name: "Español", lang: "es" },
  { name: "ภาษาไทย", lang: "th" },
];

function ChannelChip({ channel }: { channel: Channel }) {
  const style = channelStyles[channel];
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${style.className}`}
    >
      {style.label}
    </span>
  );
}

export default function LandingPage() {
  return (
    <MobileFrame>
      <div className="pb-10">
        <header className="flex items-center justify-between px-1">
          <p className="text-xl font-black tracking-tight text-green-900">Yoyakus</p>
          <Link
            href="/login"
            prefetch={false}
            className="rounded-full px-3 py-1.5 text-sm font-bold text-green-900 focus-visible:outline-2 focus-visible:outline-green-900"
          >
            ログイン
          </Link>
        </header>

        <section className="px-1 pt-8">
          <h1 className="text-[28px] leading-[1.35] font-black text-green-900">
            電話対応や紙の予約帳に、
            <br />
            もう振り回されない。
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-green-900/85">
            小さなお店のための、今日から無理なく使える予約管理アプリです。
          </p>
        </section>

        <figure className="mt-7 rounded-[28px] bg-white p-5 shadow-[0_18px_40px_-18px_rgba(50,66,94,0.55)]">
          <figcaption className="flex items-baseline justify-between">
            <span className="text-base font-black text-green-900">今日の予約</span>
            <span className="text-xs text-stone-500">表示例</span>
          </figcaption>

          <ol className="mt-3">
            {todaysBookings.map((booking, index) => (
              <li
                key={booking.time}
                className="flex min-h-12 items-center gap-3 border-t border-dashed border-green-200 py-2"
              >
                <span className="w-11 shrink-0 text-sm font-bold text-green-700 tabular-nums">
                  {booking.time}
                </span>
                {booking.menu && booking.channel ? (
                  <div
                    className="landing-booking flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-mustard-50 px-3 py-2"
                    style={{ animationDelay: `${300 + index * 220}ms` }}
                  >
                    <span className="text-[13px] font-bold text-green-900">{booking.menu}</span>
                    <ChannelChip channel={booking.channel} />
                    {booking.deposit ? (
                      <span className="text-[11px] font-bold text-green-700">予約金受取済み</span>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-[13px] text-stone-400">空き</span>
                )}
              </li>
            ))}
          </ol>
        </figure>

        <div className="mt-7">
          <Link
            href="/apply"
            className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900"
          >
            <Button size="lg" tabIndex={-1}>
              無料で使ってみる
            </Button>
          </Link>
          <p className="mt-2 text-center text-xs text-green-900/75">
            登録は数分。今なら試用期間中で無料です。
          </p>
        </div>

        <div className="mt-10 space-y-10 rounded-[28px] bg-white px-5 py-8">
          <section>
            <h2 className="text-xl leading-snug font-black text-green-900">
              予約の受け方は、お店が選べます
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              すべてをアプリにする必要はありません。使いたい方法だけ選んでください。
            </p>
            <ul className="mt-4 space-y-3">
              {channels.map((item) => (
                <li key={item.channel} className="flex items-start gap-3">
                  <span className="w-[76px] shrink-0 pt-0.5">
                    <ChannelChip channel={item.channel} />
                  </span>
                  <span className="text-sm leading-6 text-stone-700">{item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl leading-snug font-black text-green-900">
              予約金は、必要なお店だけ
            </h2>
            <p className="mt-2 mb-4 text-sm leading-6 text-stone-600">
              無断キャンセルに困っているなら、カードでの予約金を設定できます。
            </p>
            <DepositToggle />
          </section>

          <section>
            <h2 className="text-xl leading-snug font-black text-green-900">
              お店の設定は、スマホで完結
            </h2>
            <dl className="mt-4 divide-y divide-green-100">
              {settings.map((setting) => (
                <div key={setting.name} className="py-3">
                  <dt className="text-[15px] font-bold text-green-900">{setting.name}</dt>
                  <dd className="mt-0.5 text-sm text-stone-600">{setting.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl leading-snug font-black text-green-900">9つの言語で使えます</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              お客様の予約画面も、お店の管理画面も同じ言語で。
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {languages.map((language) => (
                <li
                  key={language.lang}
                  lang={language.lang}
                  className="text-2xl font-black text-green-800"
                >
                  {language.name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-4 rounded-[28px] bg-green-900 px-5 py-8 text-white">
          <h2 className="text-xl leading-snug font-black">まずは無料で試してみてください</h2>
          <p className="mt-2 text-sm leading-6 text-white/80">
            登録は数分で完了します。予約金や決済の設定は、必要になってから追加できます。
          </p>
          <Link
            href="/apply"
            className="mt-5 block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Button variant="secondary" size="lg" tabIndex={-1}>
              無料で使ってみる
            </Button>
          </Link>
        </section>

        <p className="mt-6 text-center text-sm text-green-900/80">
          すでにご利用中の店舗様は{" "}
          <Link
            href="/login"
            prefetch={false}
            className="font-bold text-green-900 underline underline-offset-2"
          >
            こちらからログイン
          </Link>
        </p>
      </div>
    </MobileFrame>
  );
}
