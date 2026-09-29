import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminApiStore } from "@/lib/adminApiAuth";
import {
  normalizeBookingRequest,
  parseStaffNames,
} from "@/lib/bookingRequest";
import {
  DirectBookingConflictError,
  createDirectBooking,
} from "@/lib/directBookings";
import { prisma } from "@/lib/prisma";
import {
  getServiceMenuBookingPrice,
  getServiceMenuForBooking,
  ServiceMenuError,
} from "@/lib/serviceMenus";

function jsonError(message: string, status: 400 | 409 | 500) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
    }
  );
}

const adminCreateBookingSchema = z.object({
  menuId: z.string().trim().min(1),
  customer: z.string().trim().min(1).max(80),
  email: z
    .string()
    .trim()
    .max(254)
    .email("メールアドレスの形式が正しくありません。")
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{8,20}$/, "電話番号の形式が正しくありません。"),
  memo: z.string().trim().max(500).optional().default(""),
  date: z.string().datetime({ offset: true }),
  duration: z.union([
    z.literal(30),
    z.literal(60),
    z.literal(90),
    z.literal(120),
  ]),
  people: z.number().int().min(1).max(4),
  staff: z.string().trim().min(1).max(200),
});

export async function POST(request: Request) {
  const { response, store } = await requireAdminApiStore();

  if (response) {
    return response;
  }

  const json = await request.json().catch(() => null);
  const parsed = adminCreateBookingSchema.safeParse(json);

  if (!parsed.success) {
    return jsonError("入力内容を確認してください。", 400);
  }

  const normalized = normalizeBookingRequest(parsed.data);

  if (!normalized || !parseStaffNames(parsed.data.staff)) {
    return jsonError("予約日時または担当者が正しくありません。", 400);
  }

  try {
    const menu = await getServiceMenuForBooking(prisma, {
      storeId: store.id,
      menuId: parsed.data.menuId,
      duration: parsed.data.duration,
    });
    const menuPrice = getServiceMenuBookingPrice(menu);

    const booking = await createDirectBooking({
      storeId: store.id,
      serviceMenuId: menu.id,
      customer: parsed.data.customer,
      email: parsed.data.email,
      phone: parsed.data.phone,
      memo: parsed.data.memo,
      bookingDate: normalized.bookingDate.bookingDate,
      dateValue: normalized.bookingDate.dateValue,
      startTime: normalized.bookingDate.timeValue,
      duration: menu.durationMinutes,
      people: parsed.data.people,
      staffNames: normalized.staffNames,
      staffLabel: normalized.staffLabel,
      menuName: menu.name,
      amount: menuPrice.totalPrice,
    });

    return NextResponse.json({
      id: booking.id,
      bookingNo: booking.bookingNo,
      status: booking.status,
    });
  } catch (error) {
    if (error instanceof ServiceMenuError) {
      return jsonError(error.message, 400);
    }

    if (error instanceof DirectBookingConflictError) {
      return jsonError(error.message, 409);
    }

    console.error("Failed to create admin booking", error);

    return jsonError("予約の作成に失敗しました。", 500);
  }
}
