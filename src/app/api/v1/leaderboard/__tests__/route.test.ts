import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// MOCKS — vi.mock is hoisted, so mock fns must be hoisted too
// ============================================================

const { mockFindMany, mockFindUnique, mockGetCurrentUser } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
  mockGetCurrentUser: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  getCurrentUser: mockGetCurrentUser,
}));

// ============================================================
// IMPORTS (after mocks)
// ============================================================

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/v1/leaderboard/route';

// ============================================================
// HELPERS
// ============================================================

function makeNextRequest(url: string): NextRequest {
  return new NextRequest(new URL(`http://localhost:3000${url}`));
}

function makeRankingUser(overrides: Record<string, unknown> = {}) {
  return {
    id: overrides.id ?? 'user-1',
    fullName: overrides.fullName ?? 'Test User',
    avatarUrl: overrides.avatarUrl ?? null,
    isPublic: overrides.isPublic ?? true,
    role: overrides.role ?? 'adopter',
    _count: { adoptions: overrides.adoptions ?? 5 },
  };
}

// ============================================================
// TESTS
// ============================================================

describe('GET /api/v1/leaderboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ----------------------------------------------------------
  // allTime — basic
  // ----------------------------------------------------------

  describe('allTime (mặc định)', () => {
    it('trả về top 20 adopter/ambassador theo số san hô đã nuôi', async () => {
      const mockUsers = Array.from({ length: 5 }, (_, i) =>
        makeRankingUser({
          id: `user-${i + 1}`,
          fullName: `Adopter ${i + 1}`,
          adoptions: 20 - i * 3,
        })
      );

      mockFindMany.mockResolvedValueOnce(mockUsers); // rankings
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]); // my ranking all adopters (won't be called since getCurrentUser returns null)

      const res = await GET(makeNextRequest('/api/v1/leaderboard?type=allTime'));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.type).toBe('allTime');
      expect(json.data.rankings).toHaveLength(5);
      expect(json.data.rankings[0].rank).toBe(1);
      expect(json.data.rankings[0].fullName).toBe('Adopter 1');
      expect(json.data.rankings[0]._count.adoptions).toBe(20);
      expect(json.data.rankings[4].rank).toBe(5);
      expect(json.data.myRanking).toBeNull();
    });

    it('trả về tối đa 20 users', async () => {
      const mockUsers = Array.from({ length: 25 }, (_, i) =>
        makeRankingUser({ id: `user-${i + 1}`, adoptions: 30 - i })
      );

      mockFindMany.mockResolvedValueOnce(mockUsers.slice(0, 20));
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard?type=allTime'));
      const json = await res.json();

      expect(json.data.rankings).toHaveLength(20);
    });

    it('lọc bỏ users có 0 adoption', async () => {
      const mockUsers = [
        makeRankingUser({ id: 'u1', fullName: 'Có nhận nuôi', adoptions: 3 }),
        makeRankingUser({ id: 'u2', fullName: 'Không nhận nuôi', adoptions: 0 }),
      ];

      mockFindMany.mockResolvedValueOnce(mockUsers);
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard?type=allTime'));
      const json = await res.json();

      expect(json.data.rankings).toHaveLength(1);
      expect(json.data.rankings[0].fullName).toBe('Có nhận nuôi');
    });
  });

  // ----------------------------------------------------------
  // monthly
  // ----------------------------------------------------------

  describe('monthly', () => {
    it('trả về top 10 cho type=monthly', async () => {
      const mockUsers = Array.from({ length: 10 }, (_, i) =>
        makeRankingUser({ id: `user-${i + 1}`, adoptions: 15 - i })
      );

      mockFindMany.mockResolvedValueOnce(mockUsers);
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard?type=monthly'));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.type).toBe('monthly');
      expect(json.data.rankings).toHaveLength(10);
    });

    it('truyền date filter cho monthly query', async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]);

      await GET(makeNextRequest('/api/v1/leaderboard?type=monthly'));

      // First call: rankings query
      const rankingsCall = mockFindMany.mock.calls[0][0];
      expect(rankingsCall.where.adoptions).toBeDefined();
      expect(rankingsCall.where.adoptions.some.createdAt.gte).toBeInstanceOf(Date);
      expect(rankingsCall.take).toBe(10);

      // Count filter uses createdAt filter
      expect(rankingsCall.select._count.select.adoptions.where.createdAt.gte).toBeInstanceOf(Date);
    });
  });

  // ----------------------------------------------------------
  // Response shape
  // ----------------------------------------------------------

  describe('Response shape', () => {
    it('mỗi ranking entry có đầy đủ các trường: rank, id, fullName, avatarUrl, isPublic, role, _count', async () => {
      mockFindMany.mockResolvedValueOnce([
        makeRankingUser({ id: 'u1', fullName: 'Test', adoptions: 7 }),
      ]);
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();
      const entry = json.data.rankings[0];

      expect(entry).toHaveProperty('rank');
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('fullName');
      expect(entry).toHaveProperty('avatarUrl');
      expect(entry).toHaveProperty('isPublic');
      expect(entry).toHaveProperty('role');
      expect(entry).toHaveProperty('_count');
      expect(entry._count).toHaveProperty('adoptions');
      expect(typeof entry.rank).toBe('number');
      expect(typeof entry._count.adoptions).toBe('number');
    });
  });

  // ----------------------------------------------------------
  // Empty state
  // ----------------------------------------------------------

  describe('Empty state', () => {
    it('trả về mảng rỗng khi không có adopter nào', async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.rankings).toHaveLength(0);
    });
  });

  // ----------------------------------------------------------
  // myRanking
  // ----------------------------------------------------------

  describe('myRanking (người dùng đã đăng nhập)', () => {
    it('trả về myRanking=null khi chưa đăng nhập', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockFindMany.mockResolvedValueOnce([
        makeRankingUser({ id: 'u1', fullName: 'Other', adoptions: 5 }),
      ]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      expect(json.data.myRanking).toBeNull();
    });

    it('trả về vị trí của current user khi đã đăng nhập', async () => {
      mockGetCurrentUser.mockResolvedValue({
        userId: 'current-user',
        email: 'me@test.com',
        role: 'adopter',
        isVerified: true,
      });

      // Rankings call
      mockFindMany.mockResolvedValueOnce([
        makeRankingUser({ id: 'u1', fullName: 'Top User', adoptions: 10 }),
      ]);

      // All adopters for my ranking calculation
      mockFindMany.mockResolvedValueOnce([
        { id: 'u1', fullName: 'Top User', avatarUrl: null, isPublic: true, role: 'adopter', _count: { adoptions: 10 } },
        { id: 'current-user', fullName: 'Tôi', avatarUrl: null, isPublic: true, role: 'adopter', _count: { adoptions: 7 } },
      ]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      expect(json.data.myRanking).not.toBeNull();
      expect(json.data.myRanking.rank).toBe(2);
      expect(json.data.myRanking.fullName).toBe('Tôi');
      expect(json.data.myRanking._count.adoptions).toBe(7);
    });

    it('tính nextRankGap chính xác (cần thêm bao nhiêu để lên hạng)', async () => {
      mockGetCurrentUser.mockResolvedValue({
        userId: 'current-user',
        email: 'me@test.com',
        role: 'adopter',
        isVerified: true,
      });

      mockFindMany.mockResolvedValueOnce([
        makeRankingUser({ id: 'u1', fullName: 'Top', adoptions: 10 }),
      ]);

      mockFindMany.mockResolvedValueOnce([
        { id: 'u1', fullName: 'Top', avatarUrl: null, isPublic: true, role: 'adopter', _count: { adoptions: 10 } },
        { id: 'current-user', fullName: 'Tôi', avatarUrl: null, isPublic: true, role: 'adopter', _count: { adoptions: 7 } },
      ]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      // Gap = 10 - 7 + 1 = 4 (cần 4 san hô nữa để vượt người trên)
      expect(json.data.myRanking.nextRankGap).toBe(4);
    });

    it('nextRankGap = null khi đang ở hạng 1', async () => {
      mockGetCurrentUser.mockResolvedValue({
        userId: 'current-user',
        email: 'me@test.com',
        role: 'adopter',
        isVerified: true,
      });

      mockFindMany.mockResolvedValueOnce([
        makeRankingUser({ id: 'current-user', fullName: 'Tôi', adoptions: 15 }),
      ]);

      mockFindMany.mockResolvedValueOnce([
        { id: 'current-user', fullName: 'Tôi', avatarUrl: null, isPublic: true, role: 'adopter', _count: { adoptions: 15 } },
      ]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      expect(json.data.myRanking.rank).toBe(1);
      expect(json.data.myRanking.nextRankGap).toBeNull();
    });

    it('không trả về myRanking nếu user không phải adopter/ambassador', async () => {
      mockGetCurrentUser.mockResolvedValue({
        userId: 'admin-user',
        email: 'admin@test.com',
        role: 'admin',
        isVerified: true,
      });

      mockFindMany.mockResolvedValueOnce([
        makeRankingUser({ id: 'u1', adoptions: 5 }),
      ]);

      // All adopters — admin not included
      mockFindMany.mockResolvedValueOnce([
        { id: 'u1', fullName: 'Adopter', avatarUrl: null, isPublic: true, role: 'adopter', _count: { adoptions: 5 } },
      ]);

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      expect(json.data.myRanking).toBeNull();
    });
  });

  // ----------------------------------------------------------
  // Error handling
  // ----------------------------------------------------------

  describe('Error handling', () => {
    it('trả về HTTP 500 khi database lỗi', async () => {
      mockFindMany.mockRejectedValue(new Error('DB connection failed'));

      const res = await GET(makeNextRequest('/api/v1/leaderboard'));
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Lỗi server');
    });
  });
});
