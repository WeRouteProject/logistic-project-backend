import express from 'express';
import {
    assignCartItems,
    getAllMyAssignments,
    updateStatus,
    fetchAllAssignements,
    getDeliveryStats,
    getDeliveryHistory, 
    getUpdatedStatus
} from '../controllers/deliveryAssignmentController.js';
import ExistingUser from '../middlewares/ExistingUser.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/assign', ExistingUser, authorizeRole(['admin']), assignCartItems);
router.get('/assigned/deliveries', ExistingUser,authorizeRole(['delivery']), getAllMyAssignments);
router.patch('/:assignmentId/status', ExistingUser, updateStatus);
router.get('/all', ExistingUser, authorizeRole(['admin']), fetchAllAssignements);
router.get('/stats/forDeliveryBoy', ExistingUser, authorizeRole(['admin', 'delivery']), getDeliveryStats);
router.get('/history', ExistingUser, getDeliveryHistory);
router.get('/delivery-status/:assignmentId', getUpdatedStatus);

export default router;