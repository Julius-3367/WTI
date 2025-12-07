const cron = require('node-cron');
const cohortAutomationService = require('../services/cohortAutomationService');

/**
 * Cohort Lifecycle Cron Jobs
 * Handles automated cohort status transitions
 */

class CohortJobs {
  /**
   * Initialize all cron jobs
   */
  static initializeJobs() {
    // Run every day at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('[CRON] Running cohort lifecycle automation...');
      try {
        await cohortAutomationService.processCohortLifecycle();
        console.log('[CRON] Cohort lifecycle automation completed');
      } catch (error) {
        console.error('[CRON] Error in cohort lifecycle automation:', error);
      }
    });

    // Run every hour to check for immediate actions
    cron.schedule('0 * * * *', async () => {
      console.log('[CRON] Running hourly cohort checks...');
      try {
        await cohortAutomationService.processCohortLifecycle();
      } catch (error) {
        console.error('[CRON] Error in hourly cohort checks:', error);
      }
    });

    console.log('[CRON] Cohort lifecycle jobs initialized');
  }

  /**
   * Run automation manually (for testing)
   */
  static async runManually() {
    console.log('Running cohort automation manually...');
    await cohortAutomationService.processCohortLifecycle();
    console.log('Manual cohort automation completed');
  }
}

module.exports = CohortJobs;
