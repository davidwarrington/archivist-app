-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "config_id" TEXT NOT NULL,
    "name" TEXT,
    "start" TEXT,
    "prefix" TEXT,
    "key" TEXT NOT NULL,
    "refill_interval" INTEGER,
    "refill_amount" INTEGER,
    "last_refill_at" DATETIME,
    "enabled" BOOLEAN,
    "rate_limit_enabled" BOOLEAN,
    "rate_limit_time_window" INTEGER,
    "rate_limit_max" INTEGER,
    "rate_limit_count" INTEGER,
    "remaining" INTEGER,
    "last_request" DATETIME,
    "expires_at" DATETIME,
    "permissions" TEXT,
    "metadata" TEXT,
    "reference_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_id_key" ON "api_keys"("id");
