import cron from 'node-cron';
import { userModel } from '../models/User.js';


export const cleanupUnverifiedUsers = () => {
    cron.schedule("* * * * *", async () => {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        try {
            const result = await userModel.deleteMany({
                isVerified: { $ne: 1 },
                createdAt: { $lt: twoMinutesAgo },
            });

            if (result.deletedCount > 0) {
                console.log(`🧹 Deleted ${result.deletedCount} unverified users`);
            }
        } catch (err) {
            console.error("❌ Error in cleanupUnverifiedUsers cron:", err.message);
        }
    });
};
