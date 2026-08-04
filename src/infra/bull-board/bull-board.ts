import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'; // Note: bullMQAdapter
import { ExpressAdapter } from '@bull-board/express';

export function setupBullBoard(queues: any[]) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: queues.map((q) => new BullMQAdapter(q)), // Changed to BullMQAdapter
    serverAdapter,
  });

  return serverAdapter;
}
