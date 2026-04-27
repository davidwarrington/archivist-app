-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "original_size" INTEGER NOT NULL,
    "original_checksum" TEXT NOT NULL,
    "content" TEXT,
    "mime_type" TEXT NOT NULL,
    "uploaded_by_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colour" TEXT
);

-- CreateTable
CREATE TABLE "document_tag" (
    "document_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("document_id", "tag_id"),
    CONSTRAINT "document_tag_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "document_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_filename_key" ON "documents"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "documents_original_checksum_key" ON "documents"("original_checksum");

-- CreateIndex
CREATE INDEX "text_search_index" ON "documents"("content");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
