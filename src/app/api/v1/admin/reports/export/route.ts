/**
 * GET /api/v1/admin/reports/export
 *
 * Server-side CSV/XLSX export for admin reports.
 * SRS AD-02, AD-07: Export CSV/Excel danh sách user, doanh thu, san hô.
 *
 * Query params:
 *   type   — 'users' | 'revenue' | 'corals' (required)
 *   format — 'csv' | 'xlsx' (default: 'csv')
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import * as XLSX from 'xlsx';

// ============================================================
// CSV Helpers
// ============================================================

/** Escape a single CSV value per RFC 4180 */
function escapeCsv(value: unknown): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/** Build a CSV string from header + rows, with UTF-8 BOM for Excel */
function buildCsv(header: string[], rows: string[][]): string {
  const headerLine = header.map(escapeCsv).join(',');
  const dataLines = rows.map((row) => row.map(escapeCsv).join(','));
  return '﻿' + [headerLine, ...dataLines].join('\n');
}

// ============================================================
// XLSX Helper
// ============================================================

function buildXlsx(sheetName: string, header: string[], rows: string[][]): ArrayBuffer {
  const data = [header, ...rows];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

// ============================================================
// Data Fetchers
// ============================================================

async function fetchUsersData() {
  const users = await prisma.user.findMany({
    select: {
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
      isActive: true,
      phone: true,
      createdAt: true,
      _count: { select: { adoptions: true, payments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const roleLabels: Record<string, string> = {
    visitor: 'Khách',
    adopter: 'Người nhận nuôi',
    ambassador: 'Đại sứ',
    admin: 'Admin',
    editor: 'Biên tập viên',
    coral_staff: 'Nhân viên san hô',
  };

  const header = ['Tên', 'Email', 'SĐT', 'Role', 'Xác thực', 'Trạng thái', 'Nhận nuôi', 'Thanh toán', 'Ngày tham gia'];
  const rows = users.map((u) => [
    u.fullName,
    u.email,
    u.phone || '',
    roleLabels[u.role] || u.role,
    u.isVerified ? 'Yes' : 'No',
    u.isActive ? 'Active' : 'Blocked',
    String(u._count.adoptions),
    String(u._count.payments),
    new Date(u.createdAt).toLocaleDateString('vi-VN'),
  ]);

  return { header, rows, filename: 'coralume-users' };
}

async function fetchRevenueData() {
  const payments = await prisma.payment.findMany({
    where: { status: 'completed' },
    select: {
      id: true,
      amount: true,
      method: true,
      createdAt: true,
      user: { select: { fullName: true, email: true } },
      adoption: { select: { customName: true, product: { select: { name: true, tier: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const header = ['Mã GD', 'Khách hàng', 'Email', 'Sản phẩm', 'Gói', 'San hô', 'Số tiền (VND)', 'Phương thức', 'Ngày'];
  const rows = payments.map((p) => [
    p.id,
    p.user.fullName,
    p.user.email,
    p.adoption?.product?.name || '',
    p.adoption?.product?.tier || '',
    p.adoption?.customName || '',
    String(p.amount),
    p.method,
    new Date(p.createdAt).toLocaleDateString('vi-VN'),
  ]);

  return { header, rows, filename: 'coralume-revenue' };
}

async function fetchCoralsData() {
  const corals = await prisma.coral.findMany({
    include: {
      adoptions: {
        select: { id: true, customName: true, user: { select: { fullName: true, email: true } } },
      },
    },
    orderBy: { code: 'asc' },
  });

  const statusLabels: Record<string, string> = {
    available: 'Có sẵn',
    assigned: 'Đã gán',
    growing: 'Đang phát triển',
    dead: 'Đã chết',
  };

  const header = ['Mã san hô', 'Loài', 'Khu vực', 'GPS', 'Trạng thái', 'Người nhận nuôi', 'Tên đặt', 'Gói'];
  const rows = corals.map((c) => [
    c.code,
    c.species || '',
    c.locationZone || '',
    c.locationGps || '',
    statusLabels[c.status] || c.status,
    c.adoptions.map((a) => a.user.fullName).join('; '),
    c.adoptions.map((a) => a.customName).join('; '),
    c.productTier || '',
  ]);

  return { header, rows, filename: 'coralume-corals' };
}

// ============================================================
// Route Handler
// ============================================================

export async function GET(request: NextRequest) {
  try {
    await requireAdminOnly();

    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || 'users';
    const format = (searchParams.get('format') || 'csv').toLowerCase();

    if (!['users', 'revenue', 'corals'].includes(type)) {
      return NextResponse.json(
        { error: 'Loại báo cáo không hợp lệ. Hỗ trợ: users, revenue, corals' },
        { status: 400 }
      );
    }

    if (!['csv', 'xlsx'].includes(format)) {
      return NextResponse.json(
        { error: 'Định dạng không hợp lệ. Hỗ trợ: csv, xlsx' },
        { status: 400 }
      );
    }

    // Fetch data based on type
    let header: string[];
    let rows: string[][];
    let filename: string;

    if (type === 'users') {
      const data = await fetchUsersData();
      header = data.header;
      rows = data.rows;
      filename = data.filename;
    } else if (type === 'revenue') {
      const data = await fetchRevenueData();
      header = data.header;
      rows = data.rows;
      filename = data.filename;
    } else {
      const data = await fetchCoralsData();
      header = data.header;
      rows = data.rows;
      filename = data.filename;
    }

    // Generate output
    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === 'xlsx') {
      const xlsxBuffer = buildXlsx('Sheet1', header, rows);
      return new NextResponse(xlsxBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}-${timestamp}.xlsx"`,
        },
      });
    }

    // Default: CSV
    const csv = buildCsv(header, rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}-${timestamp}.csv"`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('[GET /api/v1/admin/reports/export]', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
