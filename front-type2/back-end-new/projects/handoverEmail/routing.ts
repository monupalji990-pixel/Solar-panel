import { Router } from 'express';
import HandoverEmailController from './controller';

const router = Router();
const controller = new HandoverEmailController();

// Manual trigger (admin/internal)
router.post('/handover/send', async (req, res) => {
  try {
    const quoteId = req.body && req.body.quoteId;

    if (!quoteId) return res.send({ success: false, message: 'quoteId is required' });

    const result = await controller.sendHandoverForQuote({ quoteId });
    return res.send({ success: true, data: result });
  } catch (e: any) {
    return res.send({ success: false, message: e?.message || String(e) });
  }
});

export default router;

