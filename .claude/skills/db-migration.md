---
name: db-migration
description: Tạo hoặc update Prisma migration cho Coralume — schema từ SRS section 8, đúng naming convention và relation patterns
---

## Database Migration

Khi được yêu cầu tạo hoặc sửa database schema cho Coralume, tuân theo các quy tắc sau:

### 1. Schema Location

- **Schema file:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`
- **Generate command:** `npx prisma generate`
- **Migrate command:** `npx prisma migrate dev`

### 2. Naming Convention

- **Model names:** PascalCase (`User`, `Coral`, `Adoption`)
- **Table names:** snake_case (`@@map("users")`, `@@map("coral_updates")`)
- **Field names:** camelCase (`fullName`, `createdAt`)
- **Column names:** snake_case (`@map("full_name")`, `@map("created_at")`)
- **Enum values:** snake_case (`coral_staff`, `premium_plus`, `bank_transfer`)

### 3. Model Pattern

```prisma
model ModelName {
  id          String      @id @default(uuid())
  // ... fields
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  // Relations
  related     Related[]

  @@map("table_name")
}
```

### 4. Relation Patterns

**One-to-Many:**
```prisma
model User {
  adoptions Adoption[]
}

model Adoption {
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

**Self-Referential:**
```prisma
model User {
  referredBy    Referral[] @relation("ReferredBy")
  referredUsers Referral[] @relation("ReferredUsers")
}

model Referral {
  referrerId String @map("referrer_id")
  referredId String @map("referred_id")
  referrer   User   @relation("ReferredBy", fields: [referrerId], references: [id])
  referred   User   @relation("ReferredUsers", fields: [referredId], references: [id])
}
```

**One-to-One:**
```prisma
model Adoption {
  certificate Certificate?
}

model Certificate {
  adoptionId String @unique @map("adoption_id")
  adoption   Adoption @relation(fields: [adoptionId], references: [id])
}
```

### 5. Field Types

| Type | Prisma Type | PostgreSQL |
|------|------------|------------|
| ID | `String @id @default(uuid())` | UUID |
| Timestamps | `DateTime @default(now())` / `@updatedAt` | TIMESTAMP |
| Money (VND) | `Int` | INTEGER |
| Decimal | `Decimal? @db.Decimal(5, 2)` | DECIMAL(5,2) |
| Arrays | `String[]` | TEXT[] |
| JSON | `Json?` | JSONB |
| Enums | Custom enum types | Custom enum |

### 6. Migration Workflow

1. Sửa `prisma/schema.prisma`
2. `npx prisma migrate dev --name descriptive_name`
3. `npx prisma generate` (tạo types)
4. Verify types generated: `node_modules/@prisma/client/index.d.ts`

### 7. Seed Data Pattern

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 3 products
  await prisma.product.createMany({
    data: [
      {
        slug: 'seed-coral',
        name: 'Seed Coral',
        tier: 'standard',
        priceMin: 200_000,
        priceMax: 300_000,
        benefits: ['Certificate kỹ thuật số', 'Cập nhật hàng tháng', 'Dashboard cá nhân'],
      },
      // ... more products
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 8. Current Entities (12)

User, Product, Coral, Adoption, CoralUpdate, Payment, Referral, BlogPost, CommunitySubmission, Certificate, AdminActivityLog, EmailLog
