const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: 'password123',
            role: 'admin',
        },
    })

    const settings = await prisma.siteSettings.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
            siteName: 'StandCMS',
            siteDesc: 'Modern Professional CMS Platform',
        }
    })

    const home = await prisma.page.upsert({
        where: { slug: 'home' },
        update: {},
        create: {
            title: 'Welcome Home',
            slug: 'home',
            content: JSON.stringify([
                { id: '1', type: 'hero', props: { title: 'Design Your Future', subtitle: 'The most powerful drag & drop CMS.' } }
            ]),
            published: true
        }
    })

    console.log({ admin, settings, home })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
