"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AdminFrame from "@/components/layout/AdminFrame";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ServiceMenu = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
};

type Staff = {
  id: string;
  name: string;
};

type AvailabilitySlot = {
  time: string;
  availableStaff: Staff[];
  groups: Staff[][];
};

type AvailabilityResponse = {
  isClosed: boolean;
  closedReason: string | null;
  slots: AvailabilitySlot[];
  error?: string;
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewBookingPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<ServiceMenu[]>([]);
  const [menuId, setMenuId] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [people, setPeople] = useState(1);

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const [selectedTime, setSelectedTime] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Staff[] | null>(null);

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      const menusResponse = await fetch(
        "/api/service-menus?includeInactive=true",
        {
          cache: "no-store",
        }
      );

      if (menusResponse.ok) {
        const menusData = (await menusResponse.json()) as ServiceMenu[];
        const activeMenus = menusData.filter((menu) => menu.isActive);
        setMenus(activeMenus);

        if (activeMenus[0]) {
          setMenuId(activeMenus[0].id);
        }
      }
    }

    loadInitialData();
  }, []);

  const selectedMenu = useMemo(
    () => menus.find((menu) => menu.id === menuId) ?? null,
    [menus, menuId]
  );

  async function checkAvailability() {
    if (!selectedMenu) {
      return;
    }

    setIsLoadingAvailability(true);
    setAvailabilityError("");
    setAvailability(null);
    setSelectedTime("");
    setSelectedGroup(null);

    const params = new URLSearchParams({
      date,
      duration: String(selectedMenu.durationMinutes),
      people: String(people),
      menuId: selectedMenu.id,
    });

    try {
      const response = await fetch(
        `/api/admin/availability?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = (await response.json()) as AvailabilityResponse;

      if (!response.ok) {
        setAvailabilityError(data.error || "空き時間の取得に失敗しました。");
        return;
      }

      setAvailability(data);
    } catch {
      setAvailabilityError("空き時間の取得に失敗しました。");
    } finally {
      setIsLoadingAvailability(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || !selectedMenu) {
      return;
    }

    setError("");

    if (!selectedTime || !selectedGroup) {
      setError("空き時間・担当者を選択してください。");
      return;
    }

    if (!customer.trim() || !phone.trim()) {
      setError("お名前と電話番号を入力してください。");
      return;
    }

    setIsSubmitting(true);

    const staffLabel = selectedGroup.map((staff) => staff.name).join("+");
    const bookingDate = `${date}T${selectedTime}:00.000Z`;

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId: selectedMenu.id,
          customer: customer.trim(),
          phone: phone.trim(),
          email: email.trim(),
          memo: memo.trim(),
          date: bookingDate,
          duration: selectedMenu.durationMinutes,
          people,
          staff: staffLabel,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { id?: string; error?: string }
        | null;

      if (!response.ok || !data?.id) {
        setError(data?.error ?? "予約の作成に失敗しました。");

        if (response.status === 409) {
          checkAvailability();
        }

        setIsSubmitting(false);
        return;
      }

      router.push(`/admin/bookings/${data.id}`);
    } catch {
      setError("予約の作成に失敗しました。");
      setIsSubmitting(false);
    }
  }

  return (
    <AdminFrame>
      <div className="space-y-4 pb-24">
        <Link href="/admin/bookings" className="block">
          <Button variant="secondary">← 予約一覧へ戻る</Button>
        </Link>

        <Card>
          <p className="text-sm font-bold text-green-800">Yoyakus Admin</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">
            予約を手動で追加
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            電話・WhatsAppなどで受けた予約を、その場でここから登録してください。ここで確定すると、他のお客様がYoyaku上で同じ時間・担当者を予約できなくなります。すでに埋まっている時間はエラーで知らせます。
          </p>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">1. 予約内容</h2>

            <div>
              <label className="block text-sm font-bold text-stone-800">
                メニュー
              </label>
              <select
                value={menuId}
                onChange={(event) => setMenuId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
              >
                {menus.length === 0 ? (
                  <option value="">メニューがありません</option>
                ) : null}
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}({menu.durationMinutes}分・¥
                    {menu.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-stone-800">
                  日付
                </label>
                <input
                  type="date"
                  value={date}
                  min={getTodayDate()}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-800">
                  人数
                </label>
                <select
                  value={people}
                  onChange={(event) => setPeople(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
                >
                  {[1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count}人
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={checkAvailability}
              disabled={!selectedMenu || isLoadingAvailability}
            >
              {isLoadingAvailability ? "確認中..." : "空き時間を確認"}
            </Button>
          </Card>

          {availabilityError ? (
            <Card>
              <p className="text-sm font-bold text-red-700">
                {availabilityError}
              </p>
            </Card>
          ) : null}

          {availability ? (
            <Card className="space-y-3">
              <h2 className="text-lg font-bold text-stone-900">
                2. 空き時間・担当者を選択
              </h2>

              {availability.isClosed ? (
                <p className="text-sm font-bold text-red-700">
                  {availability.closedReason || "この日は予約できません。"}
                </p>
              ) : availability.slots.length === 0 ? (
                <p className="text-sm text-stone-500">
                  この日の空き時間はありません。
                </p>
              ) : (
                <div className="space-y-3">
                  {availability.slots.map((slot) => (
                    <div key={slot.time}>
                      <p className="text-sm font-bold text-stone-700">
                        {slot.time}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {slot.groups.map((group, groupIndex) => {
                          const groupLabel = group
                            .map((staff) => staff.name)
                            .join("+");
                          const isSelected =
                            selectedTime === slot.time &&
                            selectedGroup
                              ?.map((staff) => staff.name)
                              .join("+") === groupLabel;

                          return (
                            <button
                              key={groupIndex}
                              type="button"
                              onClick={() => {
                                setSelectedTime(slot.time);
                                setSelectedGroup(group);
                              }}
                              className={
                                isSelected
                                  ? "rounded-full border border-green-800 bg-green-800 px-3 py-1.5 text-xs font-bold text-white"
                                  : "rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700"
                              }
                            >
                              {groupLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : null}

          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">
              3. 予約者情報
            </h2>

            <div>
              <label className="block text-sm font-bold text-stone-800">
                お名前
              </label>
              <input
                type="text"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="山田 太郎"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800">
                電話番号
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="090-1234-5678"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800">
                メールアドレス
                <span className="ml-2 text-xs font-normal text-stone-500">
                  任意
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800">
                ご要望・メモ
                <span className="ml-2 text-xs font-normal text-stone-500">
                  任意
                </span>
              </label>
              <textarea
                rows={3}
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900"
              />
            </div>
          </Card>

          {error ? (
            <Card>
              <p className="text-sm font-bold text-red-700">{error}</p>
            </Card>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "登録しています..." : "この内容で予約を確定する"}
          </Button>
        </form>
      </div>
    </AdminFrame>
  );
}
