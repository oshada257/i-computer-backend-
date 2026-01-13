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

orderRouter.post('/', auturizationMiddleware, createOrder);

orderRouter.get('/my-orders', auturizationMiddleware, getUserOrders);

orderRouter.put('/:orderId/payment', auturizationMiddleware, updateOrderPaymentStatus);

orderRouter.get('/:orderId', auturizationMiddleware, getOrderById);

orderRouter.get('/', auturizationMiddleware, getAllOrders);
orderRouter.put('/:orderId/payment', auturizationMiddleware, updateOrderPaymentStatus);

export default orderRouter;
