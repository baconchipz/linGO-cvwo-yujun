CREATE TABLE "User"(
    "user_id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "deleted_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "User" ADD PRIMARY KEY("user_id");
CREATE TABLE "Post"(
    "user_id" BIGINT NOT NULL,
    "post_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "module_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "deleted_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "like_count" INTEGER NOT NULL
);
ALTER TABLE
    "Post" ADD PRIMARY KEY("post_id");
CREATE TABLE "Modules"(
    "module_id" BIGINT NOT NULL,
    "module_title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL
);
ALTER TABLE
    "Modules" ADD PRIMARY KEY("module_id");
CREATE TABLE "Comment"(
    "comment_id" BIGINT NOT NULL,
    "post_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "deleted_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "like_count" INTEGER NOT NULL
);
ALTER TABLE
    "Comment" ADD PRIMARY KEY("comment_id");
CREATE TABLE "User_modules"(
    "user_id" BIGINT NOT NULL,
    "module_id" BIGINT NOT NULL
);
ALTER TABLE
    "User_modules" ADD PRIMARY KEY("user_id");
ALTER TABLE
    "User_modules" ADD PRIMARY KEY("module_id");
ALTER TABLE
    "Comment" ADD CONSTRAINT "comment_post_id_foreign" FOREIGN KEY("post_id") REFERENCES "Post"("post_id");
ALTER TABLE
    "Post" ADD CONSTRAINT "post_module_id_foreign" FOREIGN KEY("module_id") REFERENCES "Modules"("module_id");
ALTER TABLE
    "User" ADD CONSTRAINT "user_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "User_modules"("user_id");
ALTER TABLE
    "Comment" ADD CONSTRAINT "comment_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "User"("user_id");
ALTER TABLE
    "Post" ADD CONSTRAINT "post_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "User"("user_id");
ALTER TABLE
    "Modules" ADD CONSTRAINT "modules_module_id_foreign" FOREIGN KEY("module_id") REFERENCES "User_modules"("module_id");