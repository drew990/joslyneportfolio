ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "heroEyebrow" TEXT NOT NULL DEFAULT 'Wedding · Portrait · Film · Nature';
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "heroButtonText" TEXT NOT NULL DEFAULT 'Explore the work';
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "heroImageAlt" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "gallerySliderTitle" TEXT NOT NULL DEFAULT 'Browse the galleries';
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "gallerySliderIntro" TEXT NOT NULL DEFAULT 'Explore Joslyne’s collections through weddings, portraits, street photography, film, and nature.';
