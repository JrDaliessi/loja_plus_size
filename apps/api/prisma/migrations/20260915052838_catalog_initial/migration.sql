-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateTable
CREATE TABLE "app"."products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "brand_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" UUID,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."brands" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."collections" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."colors" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visual_value" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."sizes" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."product_categories" (
    "product_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "app"."product_collections" (
    "product_id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,

    CONSTRAINT "product_collections_pkey" PRIMARY KEY ("product_id","collection_id")
);

-- CreateTable
CREATE TABLE "app"."product_variants" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "size_id" UUID NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "price_amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."product_media" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID,
    "color_id" UUID,
    "storage_path" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'IMAGE',
    "role" TEXT NOT NULL,
    "alt_text" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "app"."products"("slug");

-- CreateIndex
CREATE INDEX "products_brand_id_idx" ON "app"."products"("brand_id");

-- CreateIndex
CREATE INDEX "products_status_created_at_id_idx" ON "app"."products"("status", "created_at", "id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "app"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "app"."categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "app"."brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "app"."collections"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "colors_slug_key" ON "app"."colors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_code_key" ON "app"."sizes"("code");

-- CreateIndex
CREATE INDEX "product_categories_category_id_idx" ON "app"."product_categories"("category_id");

-- CreateIndex
CREATE INDEX "product_collections_collection_id_idx" ON "app"."product_collections"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "app"."product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_color_id_idx" ON "app"."product_variants"("color_id");

-- CreateIndex
CREATE INDEX "product_variants_size_id_idx" ON "app"."product_variants"("size_id");

-- CreateIndex
CREATE INDEX "product_variants_product_id_status_idx" ON "app"."product_variants"("product_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_color_size_key" ON "app"."product_variants"("product_id", "color_id", "size_id");

-- CreateIndex
CREATE INDEX "product_media_variant_id_idx" ON "app"."product_media"("variant_id");

-- CreateIndex
CREATE INDEX "product_media_color_id_idx" ON "app"."product_media"("color_id");

-- CreateIndex
CREATE INDEX "product_media_product_id_position_id_idx" ON "app"."product_media"("product_id", "position", "id");

-- CreateIndex
CREATE UNIQUE INDEX "product_media_storage_path_key" ON "app"."product_media"("storage_path");

-- AddForeignKey
ALTER TABLE "app"."products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "app"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "app"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "app"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "app"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_collections" ADD CONSTRAINT "product_collections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "app"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_collections" ADD CONSTRAINT "product_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "app"."collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "app"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_variants" ADD CONSTRAINT "product_variants_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "app"."colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_variants" ADD CONSTRAINT "product_variants_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "app"."sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "app"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_media" ADD CONSTRAINT "product_media_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "app"."product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."product_media" ADD CONSTRAINT "product_media_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "app"."colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Domain checks not represented by Prisma Schema Language.
ALTER TABLE "app"."products"
  ADD CONSTRAINT "products_status_check"
  CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

ALTER TABLE "app"."categories"
  ADD CONSTRAINT "categories_display_order_check" CHECK ("display_order" >= 0),
  ADD CONSTRAINT "categories_status_check" CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

ALTER TABLE "app"."brands"
  ADD CONSTRAINT "brands_status_check" CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

ALTER TABLE "app"."collections"
  ADD CONSTRAINT "collections_status_check" CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

ALTER TABLE "app"."colors"
  ADD CONSTRAINT "colors_display_order_check" CHECK ("display_order" >= 0),
  ADD CONSTRAINT "colors_status_check" CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

ALTER TABLE "app"."sizes"
  ADD CONSTRAINT "sizes_display_order_check" CHECK ("display_order" >= 0),
  ADD CONSTRAINT "sizes_status_check" CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  ADD CONSTRAINT "sizes_code_canonical_check" CHECK ("code" = upper(btrim("code")) AND length("code") > 0);

ALTER TABLE "app"."product_variants"
  ADD CONSTRAINT "product_variants_sku_canonical_check" CHECK ("sku" = upper(btrim("sku")) AND length("sku") > 0),
  ADD CONSTRAINT "product_variants_price_positive_check" CHECK ("price_amount" > 0),
  ADD CONSTRAINT "product_variants_currency_check" CHECK ("currency" = 'BRL'),
  ADD CONSTRAINT "product_variants_status_check" CHECK ("status" IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

ALTER TABLE "app"."product_media"
  ADD CONSTRAINT "product_media_kind_check" CHECK ("kind" IN ('IMAGE', 'VIDEO')),
  ADD CONSTRAINT "product_media_role_check" CHECK ("role" IN ('FRONT', 'BACK', 'SIDE', 'FABRIC', 'FULL_BODY', 'LOOK', 'DETAIL', 'OTHER')),
  ADD CONSTRAINT "product_media_alt_text_check" CHECK (length(btrim("alt_text")) > 0),
  ADD CONSTRAINT "product_media_position_check" CHECK ("position" >= 0);

-- Partial uniqueness keeps optional values optional while protecting real identifiers.
CREATE UNIQUE INDEX "product_variants_barcode_key"
  ON "app"."product_variants"("barcode")
  WHERE "barcode" IS NOT NULL;

CREATE UNIQUE INDEX "product_categories_one_primary_key"
  ON "app"."product_categories"("product_id")
  WHERE "is_primary";

-- Commercial tables remain outside the Data API. RLS is defense in depth.
ALTER TABLE "app"."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."brands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."colors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."sizes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."product_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."product_collections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."product_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "app"."product_media" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA "app" FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" REVOKE ALL ON SEQUENCES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON SCHEMA "app" FROM anon;
    REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON SCHEMA "app" FROM authenticated;
    REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM authenticated;
  END IF;
END
$$;
