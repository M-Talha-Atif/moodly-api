import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1757937782040 implements MigrationInterface {
  name = 'InitSchema1757937782040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" text NOT NULL, "rating" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "experienceId" uuid NOT NULL, "experienceTitle" character varying(255) NOT NULL, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "experience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "date" TIMESTAMP NOT NULL, "location" character varying NOT NULL, "image" character varying NOT NULL, "isVirtual" boolean NOT NULL, "sessionStartTime" TIMESTAMP NOT NULL, "sessionEndTime" TIMESTAMP NOT NULL, "price" integer NOT NULL, "timezone" character varying NOT NULL, "totalSpots" integer NOT NULL, "spotsFilled" integer NOT NULL DEFAULT '0', "meetingLink" character varying, "cancellationPolicy" character varying, "aiPrep" jsonb, "testimonials" jsonb, "preparation" jsonb, "targetEmotions" text, "desiredOutcomes" text, "language" character varying, "culturalTags" text array, "growthDimensions" jsonb, "experienceOutcomeSummary" text, "idealParticipantTraits" text, "engagementStats" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hostId" uuid, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingId" uuid NOT NULL, "userId" uuid NOT NULL, "experienceId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "checkInTime" TIMESTAMP, "checkOutTime" TIMESTAMP, "method" character varying NOT NULL DEFAULT 'in_person', "joinCode" character varying NOT NULL, "qrCodeUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_259f4768e8510c8b8ff9b0776c" UNIQUE ("bookingId"), CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'confirmed', "cancelledAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "experienceId" uuid, "userId" uuid, "attendanceId" uuid, CONSTRAINT "REL_83dea537d8dcd5cf696dc1033c" UNIQUE ("attendanceId"), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2674760fd08fb00ea37c12234b" ON "booking" ("experienceId", "userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "community_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "communityId" uuid, CONSTRAINT "UQ_3c7513dc4939c966a2350e50d0b" UNIQUE ("userId", "communityId"), CONSTRAINT "PK_03dff82f9cfcb02498e9f5fc640" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "community_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "authorId" uuid, CONSTRAINT "PK_bddaf18297fe4a6d1cd539586b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "community_reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "userId" uuid, CONSTRAINT "UQ_a5e68df3d90f621b306c1c872e4" UNIQUE ("postId", "userId"), CONSTRAINT "PK_2e146ef302d2e8421222402611e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "community_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "mediaUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "communityId" uuid, "authorId" uuid, CONSTRAINT "PK_af0c0b33e03b933e3e48119f2e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "communities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "coverImageUrl" character varying(500), "category" character varying(100) NOT NULL, "isPrivate" boolean NOT NULL DEFAULT false, "rules" text, "location" character varying(255), "tags" text, "memberCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_fea1fe83c86ccde9d0a089e7ea2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_501bb6c8f7c8e8a7d614d9435f" ON "communities" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d9086cef1ffd5148f90a9fab5" ON "communities" ("ownerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9538969b6a9419f88ecb0adf99" ON "communities" ("category") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9c9259f18cd0cf3bca46504c4" ON "communities" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_provider_enum" AS ENUM('local', 'google')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'host', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_accountstatus_enum" AS ENUM('active', 'suspended', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying, "name" character varying, "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'local', "avatar_url" character varying, "culturalBackground" jsonb, "languagePreferences" character varying array NOT NULL DEFAULT '{en}', "communication_style" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "accountStatus" "public"."users_accountstatus_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."privacy_settings_data_sharing_level_enum" AS ENUM('minimal', 'balanced', 'full')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."privacy_settings_community_visibility_enum" AS ENUM('private', 'connections', 'public')`,
    );
    await queryRunner.query(
      `CREATE TABLE "privacy_settings" ("user_id" uuid NOT NULL, "data_sharing_level" "public"."privacy_settings_data_sharing_level_enum" NOT NULL DEFAULT 'balanced', "community_visibility" "public"."privacy_settings_community_visibility_enum" NOT NULL DEFAULT 'connections', "tracking_consent" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_626e170465665a6a6e9831bb153" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying NOT NULL, "message" character varying, "read" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL DEFAULT 'general', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pending_feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "experienceId" uuid NOT NULL, "experienceTitle" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_27ceeec2113520b512a10d39b91" PRIMARY KEY ("id", "userId", "experienceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mood_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "moodLabel" character varying, "note" text, "textSentiment" character varying, "photoEmotion" character varying, "voiceTranscript" text, "voiceSentiment" character varying, "sameAsYesterday" boolean NOT NULL DEFAULT false, "finalMood" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f332fef75c6259bf26f25ef90c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" ADD CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" ADD CONSTRAINT "FK_81c55086576501b732df6460f94" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience" ADD CONSTRAINT "FK_3b5ac3b3fa6cdcf27371855819b" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_259f4768e8510c8b8ff9b0776c3" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_466e85b813d871bfb693f443528" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_becb0e54f8d5d70d183fae0ed0c" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_9d9b71be6be2ac33dac83900149" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_83dea537d8dcd5cf696dc1033c5" FOREIGN KEY ("attendanceId") REFERENCES "attendance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" ADD CONSTRAINT "FK_dff8a6a8aabc10e2c61e57a45f2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" ADD CONSTRAINT "FK_692f4422c79d6efe4f2cfbe6063" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_comments" ADD CONSTRAINT "FK_8cd0b0aabf6e25d0d2f28af6ea4" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_comments" ADD CONSTRAINT "FK_1ec11e701aeddaa30a81c998f23" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_reactions" ADD CONSTRAINT "FK_3532de08cae244ed5542fb6df12" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_reactions" ADD CONSTRAINT "FK_7d563b835f3908a701100f07e7f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_posts" ADD CONSTRAINT "FK_e6e5240467a0b1f3a3285eb3f5d" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_posts" ADD CONSTRAINT "FK_7c9e434b072122306431dc28d9c" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communities" ADD CONSTRAINT "FK_2d9086cef1ffd5148f90a9fab5d" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "privacy_settings" ADD CONSTRAINT "FK_626e170465665a6a6e9831bb153" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pending_feedback" ADD CONSTRAINT "FK_63f1b3f554efb2aa8c43709f6b6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pending_feedback" ADD CONSTRAINT "FK_70d1614642f1ed42907172abf4b" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pending_feedback" DROP CONSTRAINT "FK_70d1614642f1ed42907172abf4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pending_feedback" DROP CONSTRAINT "FK_63f1b3f554efb2aa8c43709f6b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "privacy_settings" DROP CONSTRAINT "FK_626e170465665a6a6e9831bb153"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communities" DROP CONSTRAINT "FK_2d9086cef1ffd5148f90a9fab5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_posts" DROP CONSTRAINT "FK_7c9e434b072122306431dc28d9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_posts" DROP CONSTRAINT "FK_e6e5240467a0b1f3a3285eb3f5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_reactions" DROP CONSTRAINT "FK_7d563b835f3908a701100f07e7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_reactions" DROP CONSTRAINT "FK_3532de08cae244ed5542fb6df12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_comments" DROP CONSTRAINT "FK_1ec11e701aeddaa30a81c998f23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_comments" DROP CONSTRAINT "FK_8cd0b0aabf6e25d0d2f28af6ea4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" DROP CONSTRAINT "FK_692f4422c79d6efe4f2cfbe6063"`,
    );
    await queryRunner.query(
      `ALTER TABLE "community_members" DROP CONSTRAINT "FK_dff8a6a8aabc10e2c61e57a45f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_83dea537d8dcd5cf696dc1033c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_9d9b71be6be2ac33dac83900149"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_becb0e54f8d5d70d183fae0ed0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_466e85b813d871bfb693f443528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_259f4768e8510c8b8ff9b0776c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience" DROP CONSTRAINT "FK_3b5ac3b3fa6cdcf27371855819b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" DROP CONSTRAINT "FK_81c55086576501b732df6460f94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" DROP CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c"`,
    );
    await queryRunner.query(`DROP TABLE "mood_log"`);
    await queryRunner.query(`DROP TABLE "pending_feedback"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "privacy_settings"`);
    await queryRunner.query(
      `DROP TYPE "public"."privacy_settings_community_visibility_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."privacy_settings_data_sharing_level_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_accountstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_provider_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9c9259f18cd0cf3bca46504c4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9538969b6a9419f88ecb0adf99"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d9086cef1ffd5148f90a9fab5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_501bb6c8f7c8e8a7d614d9435f"`,
    );
    await queryRunner.query(`DROP TABLE "communities"`);
    await queryRunner.query(`DROP TABLE "community_posts"`);
    await queryRunner.query(`DROP TABLE "community_reactions"`);
    await queryRunner.query(`DROP TABLE "community_comments"`);
    await queryRunner.query(`DROP TABLE "community_members"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2674760fd08fb00ea37c12234b"`,
    );
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TABLE "attendance"`);
    await queryRunner.query(`DROP TABLE "experience"`);
    await queryRunner.query(`DROP TABLE "feedback"`);
  }
}
