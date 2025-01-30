CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"lastName" varchar,
	"key" varchar NOT NULL,
	"userName" varchar,
	"privileges" varchar[],
	"area" varchar[],
	"password" varchar NOT NULL
);
