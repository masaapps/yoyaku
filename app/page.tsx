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
        <Card className="space-y-4 text-center">
          <p className="text-sm font-bold text-green-800">Yoyakus</p>
          <h1 className="text-3xl font-black leading-tight text-stone-900">
            電話・紙の予約帳のお店でも、
            <br />
            今日から使える予約システム
          </h1>
          <p className="text-sm leading-6 text-stone-600">
            マッサージ・リラクゼーション店のための、無理なく始められる予約管理サービスです。難しい設定なしで、今日からお店の予約を受け付けられます。
          </p>
          <Link href="/apply" className="block">
            <Button>無料で使ってみる</Button>
          </Link>
        </Card>

        {features.map((feature) => (
          <Card key={feature.title} className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">
              {feature.title}
            </h2>
            <p className="text-sm leading-6 text-stone-600">{feature.body}</p>
          </Card>
        ))}

        <Card className="space-y-3">
          <h2 className="text-lg font-bold text-stone-900">
            登録すると、あなたのお店の予約ページができます
          </h2>
          <p className="text-sm leading-6 text-stone-600">
            以下はサンプル画面です。実際には、お店の名前・メニュー・料金が反映されたページが、専用のURLで公開されます。
          </p>

          <div className="overflow-hidden rounded-[28px] border border-stone-200 shadow-md">
            <div className="relative h-32 bg-gradient-to-br from-[#2b241d] via-[#5f4b36] to-[#c9ad7f] text-white">
              <div className="absolute inset-0 bg-black/25" />
              <div className="relative z-10 flex h-full flex-col justify-end p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                  サンプル
                </p>
                <h3 className="font-serif text-2xl leading-tight">
                  ◯◯マッサージ
                </h3>
              </div>
            </div>

            <div className="space-y-2 bg-white p-4">
              {sampleMenu.map((menu) => (
                <div
                  key={menu.name}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 px-3 py-2"
                >
                  <span className="text-sm font-bold text-stone-800">
                    {menu.name}
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    ¥{menu.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

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
