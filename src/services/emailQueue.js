const { Queue } = require("bullmq");

const QUEUE_NAME = "email-sending-queue";

let emailQueue = null;

// Only initialize queue if Redis is available and FORCE_REDIS is true
if (process.env.REDIS_URL && process.env.FORCE_REDIS === 'true') {
  try {
    emailQueue = new Queue(QUEUE_NAME, {
      connection: {
        url: process.env.REDIS_URL,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    });
  } catch (error) {
    console.error('Failed to initialize email queue:', error.message);
  }
}

/**
 * Add email job to queue
 */
const addEmailJob = async (emailData) => {
  if (!emailQueue) {
    console.warn('Email queue not available - email job skipped');
    return null;
  }
  try {
    const job = await emailQueue.add("send-email", emailData, {
      priority: emailData.priority || 5,
    });

    console.log(`Email job added to queue: ${job.id}`);
    return job;
  } catch (error) {
    console.error("Error adding email to queue:", error);
    throw error;
  }
};

/**
 * Add bulk email jobs
 */
const addBulkEmailJobs = async (emailsData) => {
  if (!emailQueue) {
    console.warn('Email queue not available - bulk email jobs skipped');
    return [];
  }
  try {
    const jobs = emailsData.map((emailData) => ({
      name: "send-email",
      data: emailData,
      opts: {
        priority: emailData.priority || 5,
      },
    }));

    const addedJobs = await emailQueue.addBulk(jobs);
    console.log(`${addedJobs.length} email jobs added to queue`);
    return addedJobs;
  } catch (error) {
    console.error("Error adding bulk emails to queue:", error);
    throw error;
  }
};

/**
 * Get queue stats
 */
const getQueueStats = async () => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      emailQueue.getWaitingCount(),
      emailQueue.getActiveCount(),
      emailQueue.getCompletedCount(),
      emailQueue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
    };
  } catch (error) {
    console.error("Error getting queue stats:", error);
    throw error;
  }
};

module.exports = {
  emailQueue,
  addEmailJob,
  addBulkEmailJobs,
  getQueueStats,
};
