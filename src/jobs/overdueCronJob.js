import cron from 'node-cron';
import { TaskService } from '../services/taskService.js';

const taskService = new TaskService();

export const startOverdueCronJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running overdue task check...');
      const count = await taskService.markTasksOverdue();
      console.log(`Marked ${count} tasks as overdue`);
    } catch (error) {
      console.error('Error in overdue cron job:', error);
    }
  });

  console.log('Overdue task cron job started (runs every hour)');
};
