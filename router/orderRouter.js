import express from "express";
import { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    getAllOrders, 
    updateOrderPaymentStatus 
} from "../controllers/orderControllers.js";
import auturizationMiddleware from "../lib/jwtMiddleWare.js";

const orderRouter = express.Router();

// Create new order (requires authentication)
orderRouter.post('/', auturizationMiddleware, createOrder);

// Get all orders for logged-in user
orderRouter.get('/my-orders', auturizationMiddleware, getUserOrders);

// Update payment status
orderRouter.put('/:orderId/payment', auturizationMiddleware, updateOrderPaymentStatus);

// Get specific order by ID (user can only access their own orders)
orderRouter.get('/:orderId', auturizationMiddleware, getOrderById);

// Admin routes - get all orders (must be after specific routes)
orderRouter.get('/', auturizationMiddleware, getAllOrders);
orderRouter.put('/:orderId/payment', auturizationMiddleware, updateOrderPaymentStatus);

export default orderRouter;
