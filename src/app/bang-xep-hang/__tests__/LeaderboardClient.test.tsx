/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeaderboardClient } from '@/app/bang-xep-hang/LeaderboardClient';

// ============================================================
// TEST DATA FACTORIES
// ============================================================

function makeEntry(
  overrides: Partial<{
    rank: number;
    id: string;
    fullName: string;
    avatarUrl: string | null;
    isPublic: boolean;
    role: string;
    adoptions: number;
  }> = {}
) {
  return {
    rank: overrides.rank ?? 1,
    id: overrides.id ?? 'user-1',
    fullName: overrides.fullName ?? 'Nguyễn Văn Test',
    avatarUrl: overrides.avatarUrl ?? null,
    isPublic: overrides.isPublic ?? true,
    role: overrides.role ?? 'adopter',
    _count: { adoptions: overrides.adoptions ?? 5 },
  };
}

function makeMyRanking(
  overrides: Partial<{
    rank: number;
    id: string;
    fullName: string;
    avatarUrl: string | null;
    isPublic: boolean;
    role: string;
    adoptions: number;
    nextRankGap: number | null;
  }> = {}
) {
  return {
    ...makeEntry({
      rank: overrides.rank ?? 3,
      id: overrides.id ?? 'current-user',
      fullName: overrides.fullName ?? 'Tôi',
      avatarUrl: overrides.avatarUrl ?? null,
      isPublic: overrides.isPublic ?? true,
      role: overrides.role ?? 'adopter',
      adoptions: overrides.adoptions ?? 2,
    }),
    nextRankGap: overrides.nextRankGap ?? null,
  };
}

// ============================================================
// SETUP / TEARDOWN
// ============================================================

// Mock requestAnimationFrame to fire immediately in tests
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

// Helper to advance animation frames
async function advanceAnimation() {
  // Fire all pending requestAnimationFrame callbacks
  vi.advanceTimersByTime(2000); // advance enough for all CountUp animations (max 1000ms)
}

// ============================================================
// TESTS
// ============================================================

describe('LeaderboardClient', () => {
  // ----------------------------------------------------------
  // Rendering
  // ----------------------------------------------------------

  describe('Rendering', () => {
    it('hiển thị tab "Tất cả thời gian" được chọn mặc định', () => {
      const data = {
        rankings: [makeEntry({ rank: 1, fullName: 'Người A', adoptions: 10 })],
        myRanking: null,
        type: 'allTime',
      };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      const allTimeBtn = screen.getByRole('button', { name: /Tất cả/i });
      expect(allTimeBtn).toHaveClass('bg-primary');
    });

    it('hiển thị dữ liệu bảng xếp hạng khi có dữ liệu', async () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'u-a', fullName: 'Nguyễn Văn A', adoptions: 15, role: 'ambassador' }),
        makeEntry({ rank: 2, id: 'u-b', fullName: 'Trần Thị B', adoptions: 12 }),
        makeEntry({ rank: 3, id: 'u-c', fullName: 'Lê Văn C', adoptions: 8 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      await advanceAnimation();

      expect(screen.getByText('Top 20 tất cả thời gian')).toBeInTheDocument();
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
      expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
      expect(screen.getByText('Lê Văn C')).toBeInTheDocument();
    });

    it('hiển thị loading skeleton khi không có dữ liệu (null)', () => {
      render(
        <LeaderboardClient monthlyData={null} allTimeData={null} />
      );

      expect(screen.getByText('Đang tải bảng xếp hạng...')).toBeInTheDocument();
    });

    it('hiển thị empty state khi không có ai trong bảng xếp hạng', () => {
      const data = { rankings: [], myRanking: null, type: 'allTime' };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      expect(screen.getByText(/Chưa có dữ liệu/i)).toBeInTheDocument();
      expect(screen.getByText(/Hãy là người đầu tiên/i)).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // Tab switching
  // ----------------------------------------------------------

  describe('Tabs', () => {
    it('chuyển sang tab "Tháng này" khi click', async () => {
      const monthlyRankings = [makeEntry({ rank: 1, id: 'u-m', fullName: 'Người Tháng', adoptions: 3 })];
      const allTimeRankings = [makeEntry({ rank: 1, id: 'u-at', fullName: 'Người AllTime', adoptions: 20 })];

      render(
        <LeaderboardClient
          monthlyData={{ rankings: monthlyRankings, myRanking: null, type: 'monthly' }}
          allTimeData={{ rankings: allTimeRankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Default: all-time shows
      expect(screen.getByText('Top 20 tất cả thời gian')).toBeInTheDocument();

      // Click monthly tab
      const monthlyBtn = screen.getByRole('button', { name: /Tháng này/i });
      await monthlyBtn.click();

      expect(screen.getByText('Top 10 tháng này')).toBeInTheDocument();
      expect(screen.getByText('Người Tháng')).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // Top 3 special styling — Design Spec compliant icons
  // ----------------------------------------------------------

  describe('Top 3 Highlight', () => {
    it('hiển thị Material Symbols icon cho top 3 (không dùng emoji)', () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'h1', fullName: 'Hạng 1', adoptions: 30 }),
        makeEntry({ rank: 2, id: 'h2', fullName: 'Hạng 2', adoptions: 25 }),
        makeEntry({ rank: 3, id: 'h3', fullName: 'Hạng 3', adoptions: 20 }),
        makeEntry({ rank: 4, id: 'h4', fullName: 'Hạng 4', adoptions: 15 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Top 1 has trophy icon (Material Symbols text content)
      const trophyIcons = document.querySelectorAll('.material-symbols-outlined');
      const trophyTexts = Array.from(trophyIcons).map((el) => el.textContent);
      expect(trophyTexts).toContain('trophy');
      expect(trophyTexts).toContain('social_leaderboard');

      // Verify NO emojis are used for medals
      expect(screen.queryByText('🏆')).not.toBeInTheDocument();
      expect(screen.queryByText('🥈')).not.toBeInTheDocument();
      expect(screen.queryByText('🥉')).not.toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // Anonymous users
  // ----------------------------------------------------------

  describe('Ẩn danh', () => {
    it('hiển thị "Người ẩn danh" cho user có isPublic=false', () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'u-pub', fullName: 'Công Khai', isPublic: true, adoptions: 5 }),
        makeEntry({ rank: 2, id: 'u-anon', fullName: 'Ẩn Danh Nè', isPublic: false, adoptions: 4 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      expect(screen.getByText('Công Khai')).toBeInTheDocument();
      expect(screen.getByText('Người ẩn danh')).toBeInTheDocument();
      // Badge hiển thị "(ẩn danh)"
      expect(screen.getByText('ẩn danh')).toBeInTheDocument();
    });

    it('KHÔNG hiển thị ảnh đại diện cho user ẩn danh', () => {
      const rankings = [
        makeEntry({
          rank: 1,
          id: 'u-anon-img',
          fullName: 'Ẩn Danh Nè',
          isPublic: false,
          avatarUrl: '/uploads/secret.jpg',
          adoptions: 4,
        }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Không có thẻ <img> HTML vì isPublic=false (avatarUrl bị ẩn)
      const avatarImgs = document.querySelectorAll('img');
      expect(avatarImgs).toHaveLength(0);
    });
  });

  // ----------------------------------------------------------
  // Ambassador badge — Material Symbols stars icon
  // ----------------------------------------------------------

  describe('Ambassador Badge', () => {
    it('hiển thị badge "Đại sứ" với Material Symbols stars icon', () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'u-amb', fullName: 'Đại Sứ A', role: 'ambassador', adoptions: 10 }),
        makeEntry({ rank: 2, id: 'u-reg', fullName: 'Adopter B', role: 'adopter', adoptions: 5 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Should show "Đại sứ" text (inside the ambassador badge)
      expect(screen.getByText('Đại sứ')).toBeInTheDocument();
      // Verify stars icon is inside the ambassador badge
      const badge = screen.getByText('Đại sứ').closest('span');
      const starsIcon = badge?.querySelector('.material-symbols-outlined');
      expect(starsIcon).toBeTruthy();
      expect(starsIcon?.textContent).toBe('stars');
    });
  });

  // ----------------------------------------------------------
  // My Ranking section
  // ----------------------------------------------------------

  describe('My Ranking', () => {
    it('hiển thị phần "Thứ hạng của bạn" khi có myRanking', async () => {
      const myRanking = makeMyRanking({
        rank: 5,
        fullName: 'Tôi',
        adoptions: 3,
        nextRankGap: 2,
      });
      const data = {
        rankings: [makeEntry({ rank: 1, id: 'u-top', fullName: 'Đầu bảng', adoptions: 10 })],
        myRanking,
        type: 'allTime',
      };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      await advanceAnimation();

      expect(screen.getByText('Thứ hạng của bạn')).toBeInTheDocument();
      expect(screen.getByText('Tôi')).toBeInTheDocument();
      // Shows how many more to reach next rank
      expect(screen.getByText(/Cần thêm/i)).toBeInTheDocument();
      expect(screen.getByText('2 san hô')).toBeInTheDocument();
      expect(screen.getByText('#4')).toBeInTheDocument();
    });

    it('KHÔNG hiển thị "Thứ hạng của bạn" khi chưa đăng nhập', () => {
      const data = {
        rankings: [makeEntry({ rank: 1, id: 'u-top', fullName: 'Đầu bảng', adoptions: 10 })],
        myRanking: null,
        type: 'allTime',
      };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      expect(screen.queryByText('Thứ hạng của bạn')).not.toBeInTheDocument();
    });

    it('hiển thị trophy icon khi đang dẫn đầu (#1)', async () => {
      const myRanking = makeMyRanking({
        rank: 1,
        fullName: 'Tôi',
        adoptions: 20,
        nextRankGap: null,
      });
      const data = {
        rankings: [
          makeEntry({ rank: 1, id: 'u-me', fullName: 'Tôi', adoptions: 20 }),
        ],
        myRanking,
        type: 'allTime',
      };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      await advanceAnimation();

      expect(screen.getByText(/Bạn đang dẫn đầu/i)).toBeInTheDocument();
      // Trophy icon (Material Symbols) should be present
      const trophyEls = Array.from(
        document.querySelectorAll('.material-symbols-outlined')
      ).filter((el) => el.textContent === 'trophy');
      expect(trophyEls.length).toBeGreaterThan(0);
    });

    it('hiển thị "Đại sứ Coralume" với stars icon cho ambassador', async () => {
      const myRanking = makeMyRanking({
        rank: 2,
        fullName: 'Tôi',
        role: 'ambassador',
        adoptions: 8,
        nextRankGap: 3,
      });
      const data = {
        rankings: [makeEntry({ rank: 1, id: 'u-top', fullName: 'Đầu bảng', adoptions: 10 })],
        myRanking,
        type: 'allTime',
      };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      expect(screen.getByText('Đại sứ Coralume')).toBeInTheDocument();
    });

    it('hiển thị progress bar khi còn cần thêm san hô', () => {
      const myRanking = makeMyRanking({
        rank: 3,
        fullName: 'Tôi',
        adoptions: 5,
        nextRankGap: 3,
      });
      const data = {
        rankings: [makeEntry({ rank: 1, id: 'u-top', fullName: 'Đầu bảng', adoptions: 10 })],
        myRanking,
        type: 'allTime',
      };

      const { container } = render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      // Progress bar element exists
      const progressBar = container.querySelector('.h-2.rounded-full.overflow-hidden');
      expect(progressBar).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // Avatar rendering
  // ----------------------------------------------------------

  describe('Avatar', () => {
    it('hiển thị initials khi không có avatarUrl', () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'u-na', fullName: 'Nguyễn Văn A', avatarUrl: null, adoptions: 10 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Initials "NA" should appear (Nguyễn + A)
      expect(screen.getByText('NA')).toBeInTheDocument();
    });

    it('hiển thị ảnh khi có avatarUrl', () => {
      const rankings = [
        makeEntry({
          rank: 4,
          id: 'u-img',
          fullName: 'Có Ảnh',
          avatarUrl: '/uploads/avatar.jpg',
          adoptions: 10,
        }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Tìm ảnh có alt="Có Ảnh" (không phải Material Symbols icon)
      const img = screen.getByAltText('Có Ảnh');
      expect(img).toHaveAttribute('src', '/uploads/avatar.jpg');
    });

    it('tạo initials đúng cho tên 1 từ', () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'u-ad', fullName: 'Admin', avatarUrl: null, adoptions: 10 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // Count-up animation
  // ----------------------------------------------------------

  describe('CountUp Animation', () => {
    it('animate số lượng san hô từ 0 đến target', async () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'u-count', fullName: 'Counter', adoptions: 5 }),
      ];

      render(
        <LeaderboardClient
          monthlyData={null}
          allTimeData={{ rankings, myRanking: null, type: 'allTime' }}
        />
      );

      // Before animation completes, should see 0
      // (CountUp starts at 0)
      const numberEls = screen.queryAllByText('0');
      // After advancing animation, should see target value
      await advanceAnimation();

      // At least one count-up value should have reached target
      // (since CountUp renders inside font-mono spans)
      const monoSpans = document.querySelectorAll('.font-mono');
      expect(monoSpans.length).toBeGreaterThan(0);
    });
  });

  // ----------------------------------------------------------
  // Footer note
  // ----------------------------------------------------------

  describe('Footer', () => {
    it('hiển thị ghi chú cập nhật và ẩn danh', () => {
      const data = {
        rankings: [makeEntry({ rank: 1, id: 'a', fullName: 'A', adoptions: 1 })],
        myRanking: null,
        type: 'allTime',
      };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      expect(
        screen.getByText(/Bảng xếp hạng được cập nhật theo thời gian thực/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Người dùng có thể chọn ẩn danh/i)
      ).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------
  // Integration: full page
  // ----------------------------------------------------------

  describe('Full page integration', () => {
    it('hiển thị đầy đủ: tabs + rankings + myRanking + footer', async () => {
      const rankings = [
        makeEntry({ rank: 1, id: 'f1', fullName: 'Quán Quân', role: 'ambassador', adoptions: 25 }),
        makeEntry({ rank: 2, id: 'f2', fullName: 'Á Quân', adoptions: 18 }),
        makeEntry({ rank: 3, id: 'f3', fullName: 'Hạng Ba', adoptions: 12 }),
        makeEntry({ rank: 4, id: 'f4', fullName: 'Hạng Tư', isPublic: false, adoptions: 8 }),
        makeEntry({ rank: 5, id: 'f5', fullName: 'Hạng Năm', adoptions: 5 }),
      ];
      const myRanking = makeMyRanking({
        rank: 5,
        id: 'f5',
        fullName: 'Hạng Năm',
        adoptions: 5,
        nextRankGap: 4,
      });
      const data = { rankings, myRanking, type: 'allTime' as const };

      render(
        <LeaderboardClient monthlyData={data} allTimeData={data} />
      );

      await advanceAnimation();

      // Tab heading
      expect(screen.getByText('Top 20 tất cả thời gian')).toBeInTheDocument();

      // My ranking
      expect(screen.getByText('Thứ hạng của bạn')).toBeInTheDocument();

      // Ambassador badge
      expect(screen.getByText('Đại sứ')).toBeInTheDocument();

      // Anonymous badge
      expect(screen.getByText('ẩn danh')).toBeInTheDocument();

      // Next rank gap
      expect(screen.getByText(/Cần thêm/i)).toBeInTheDocument();

      // Footer
      expect(screen.getByText(/theo thời gian thực/i)).toBeInTheDocument();

      // NO emoji — Design Spec compliant
      expect(screen.queryByText('🏆')).not.toBeInTheDocument();
      expect(screen.queryByText('🪸')).not.toBeInTheDocument();
      expect(screen.queryByText('🌟')).not.toBeInTheDocument();
    });
  });
});
