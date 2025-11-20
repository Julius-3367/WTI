const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateTestNotifications() {
  try {
    console.log('🔔 Generating test notifications...\n');

    // Get admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          name: 'Admin'
        }
      },
      take: 5
    });

    if (adminUsers.length === 0) {
      console.log('❌ No admin users found. Trying to find any user...');
      const anyUser = await prisma.user.findFirst();
      if (!anyUser) {
        console.log('❌ No users found in database.');
        return;
      }
      adminUsers.push(anyUser);
    }

    const notifications = [];
    const now = new Date();

    // Sample notifications for each admin
    for (const admin of adminUsers) {
      // Recent notifications (last 5 minutes)
      notifications.push({
        userId: admin.id,
        tenantId: admin.tenantId || 1,
        channel: 'IN_APP',
        templateKey: 'NEW_APPLICATION',
        payload: {
          title: 'New job application',
          message: 'John Doe applied for Construction Worker position',
          type: 'INFO',
        },
        status: 'SENT',
        sentAt: new Date(now.getTime() - 5 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 60 * 1000),
        createdBy: admin.id,
      });

      // 1 hour ago
      notifications.push({
        userId: admin.id,
        tenantId: admin.tenantId || 1,
        channel: 'IN_APP',
        templateKey: 'COURSE_COMPLETED',
        payload: {
          title: 'Course completed',
          message: 'Safety Training course has been completed by 15 candidates',
          type: 'SUCCESS',
        },
        status: 'SENT',
        sentAt: new Date(now.getTime() - 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 60 * 60 * 1000),
        createdBy: admin.id,
      });

      // 3 hours ago
      notifications.push({
        userId: admin.id,
        tenantId: admin.tenantId || 1,
        channel: 'IN_APP',
        templateKey: 'PAYMENT_RECEIVED',
        payload: {
          title: 'Payment received',
          message: 'Payment of AED 2,500 received from Emirates Construction LLC',
          type: 'SUCCESS',
        },
        status: 'SENT',
        sentAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        createdBy: admin.id,
      });

      // Yesterday
      notifications.push({
        userId: admin.id,
        tenantId: admin.tenantId || 1,
        channel: 'IN_APP',
        templateKey: 'CERTIFICATE_EXPIRING',
        payload: {
          title: 'Certificate expiring soon',
          message: 'Safety certification for Jane Smith expires in 7 days',
          type: 'WARNING',
        },
        status: 'SENT',
        sentAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        createdBy: admin.id,
      });

      // 2 days ago
      notifications.push({
        userId: admin.id,
        tenantId: admin.tenantId || 1,
        channel: 'IN_APP',
        templateKey: 'NEW_ENROLLMENT',
        payload: {
          title: 'New enrollment',
          message: 'Sarah Johnson enrolled in Heavy Equipment Operation course',
          type: 'INFO',
        },
        status: 'SENT',
        sentAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        createdBy: admin.id,
      });

      // 3 days ago
      notifications.push({
        userId: admin.id,
        tenantId: admin.tenantId || 1,
        channel: 'IN_APP',
        templateKey: 'ATTENDANCE_ISSUE',
        payload: {
          title: 'Attendance issue',
          message: 'Multiple absences recorded for Mike Brown in Plumbing Basics',
          type: 'ERROR',
        },
        status: 'SENT',
        sentAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
        createdBy: admin.id,
      });
    }

    // Create notifications in database
    await prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully created ${notifications.length} test notifications!`);
    console.log(`\nNotifications distributed to ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(admin => {
      console.log(`  - ${admin.firstName} ${admin.lastName} (${admin.email})`);
    });

    // Count unread notifications per user
    for (const admin of adminUsers) {
      const recentCount = await prisma.notification.count({
        where: {
          userId: admin.id,
          status: 'SENT',
        },
      });
      console.log(`\n📧 ${admin.firstName} ${admin.lastName} has ${recentCount} notifications`);
    }

    console.log('\n🎉 Done! Refresh your admin dashboard to see the notifications.\n');

  } catch (error) {
    console.error('❌ Error generating notifications:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

generateTestNotifications();
