import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

const categories = [
  'Weddings',
  'Portraits / People',
  'Street Photography',
  'Film Photography',
  'Nature'
];

async function main() {
  const adminUsername = (process.env.ADMIN_USERNAME || 'joslyne').trim();
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: null,
      hasEnteredAccount: false,
      accountSetupComplete: false
    }
  });

  const admin = await prisma.adminUser.findUnique({ where: { username: adminUsername } });

  // v7 repair: previous builds could mark the admin as already entered before
  // the first-password setup flow was completed correctly. The new
  // accountSetupComplete flag is the only source of truth for whether setup
  // has really been completed. Existing databases get this flag as false, so
  // npm run dev returns the admin to Create Admin Password automatically.
  if (admin && admin.accountSetupComplete !== true) {
    await prisma.adminUser.update({
      where: { username: adminUsername },
      data: { hasEnteredAccount: false, passwordHash: null, lastLoginAt: null, accountSetupComplete: false }
    });
  }

  for (const [index, name] of categories.entries()) {
    const slug = slugify(name, { lower: true, strict: true });
    await prisma.category.upsert({
      where: { slug },
      update: { name, sortOrder: index },
      create: { name, slug, sortOrder: index }
    });
  }

  const existingAbout = await prisma.aboutPage.findFirst();
  if (!existingAbout) {
    await prisma.aboutPage.create({
      data: {
        headline: 'About Joslyne',
        body: 'Use the admin dashboard to replace this text with Joslyne\'s story, photography style, and booking information.'
      }
    });
  }

  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Joslyne Keehmer',
        homepageTitle: 'Photography for honest, timeless moments',
        homepageIntro: 'Weddings, portraits, street, film, and nature photography with a warm editorial eye.',
        heroEyebrow: 'Wedding · Portrait · Film · Nature',
        heroButtonText: 'Explore the work',
        gallerySliderTitle: 'Browse the galleries',
        gallerySliderIntro: 'A rotating look at Joslyne’s collections. Upload cover-worthy photos and mark your strongest work as featured.'
      }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
