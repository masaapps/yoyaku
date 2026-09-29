import Link from "next/link";

import MobileFrame from "@/components/layout/MobileFrame";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const features = [
  {
    title: "電話・WhatsApp・アプリ予約、好きな方法を選べる",
    body: "お客様は空いている時間を見て、電話・WhatsApp・アプリ内予約のうち、お店が選んだ方法で連絡できます。すべてをアプリ化する必要はありません。",
  },
  {
    title: "予約金(デポジット)で無断キャンセルを防止",
    body: "ご希望の店舗様だけ、カードでの予約金の受け取りを設定できます。無理に導入する必要はなく、今まで通りの現地払いのままでもご利用いただけます。",
  },
  {
    title: "メニュー・スタッフ・スケジュールをまとめて管理",
    body: "施術メニューや料金、スタッフの出勤表、営業時間・休業日を、スマホから簡単に設定・変更できます。",
  },
  {
    title: "9言語に対応",
    body: "日本語・英語・中国語・韓国語・ドイツ語・オランダ語・フランス語・スペイン語・タイ語で、お客様にも管理画面にも対応しています。",
  },
];

const sampleMenu = [
  { name: "全身マッサージ 60分", price: 6000 },
  { name: "フットマッサージ 30分", price: 3500 },
  { name: "全身+フット 90分", price: 9000 },
];

export default function LandingPage() {
  return (
    <MobileFrame>
      <div className="space-y-4 pb-12">
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-green-900 via-green-800 to-green-600 px-6 pb-7 pt-8 text-center text-white shadow-xl">
          <p className="text-2xl font-black tracking-wide">Yoyakus</p>

          <h1 className="mt-4 text-xl font-bold leading-relaxed">
            「電話対応や紙の予約帳に、
            <br />
            もう振り回されたくない」
          </h1>

          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-white/85">
            そんな小さなお店のための、今日から無理なく使える予約管理アプリです。
          </p>

          <div className="mx-auto mt-6 w-[200px] rounded-[32px] border-[6px] border-stone-950 bg-stone-950 shadow-2xl">
            <div className="overflow-hidden rounded-[24px] bg-stone-100">
              <div className="relative h-24 bg-gradient-to-br from-[#2b241d] via-[#5f4b36] to-[#c9ad7f]">
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10 flex h-full flex-col justify-end p-3 text-left">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-white/80">
                    サンプル
                  </p>
                  <p className="font-serif text-base leading-tight text-white">
                    ◯◯マッサージ
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 bg-white p-3">
                {sampleMenu.map((menu) => (
                  <div
                    key={menu.name}
                    className="flex items-center justify-between rounded-xl border border-stone-200 px-2 py-1.5"
                  >
                    <span className="text-[10px] font-bold text-stone-800">
                      {menu.name}
                    </span>
                    <span className="text-[10px] font-bold text-stone-900">
                      ¥{menu.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/apply" className="mx-auto mt-6 block max-w-[280px]">
            <Button variant="secondary">無料で使ってみる</Button>
          </Link>

          <p className="mt-2 text-xs text-white/70">
            登録は数分。今なら試用期間中で無料です。
          </p>
        </div>

        {features.map((feature) => (
          <Card key={feature.title} className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">
              {feature.title}
            </h2>
            <p className="text-sm leading-6 text-stone-600">{feature.body}</p>
          </Card>
        ))}

        <Card className="space-y-3 text-center">
          <h2 className="text-lg font-bold text-stone-900">
            まずは無料でお試しください
          </h2>
          <p className="text-sm leading-6 text-stone-600">
            登録は数分で完了します。予約金(デポジット)や決済の設定は、必要になったタイミングで後から追加できます。
          </p>
          <Link href="/apply" className="block">
            <Button>無料で使ってみる</Button>
          </Link>
        </Card>

        <p className="text-center text-sm text-stone-500">
          すでにご利用中の店舗様は{" "}
          <Link href="/login" className="font-bold text-green-800">
            こちらからログイン
          </Link>
        </p>
      </div>
    </MobileFrame>
  );
}
