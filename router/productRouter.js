import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, uploadProductImage, uploadProductImages, getOnSaleProducts, toggleProductOnSale } from "../controllers/productControllers.js";
import upload from "../lib/uploadMiddleware.js";
import auturizationMiddleware from "../lib/jwtMiddleWare.js";

const productRouter = express.Router();

productRouter.post('/upload-image', auturizationMiddleware, upload.single('image'), uploadProductImage);
productRouter.post('/upload-images', auturizationMiddleware, upload.array('images', 5), uploadProductImages);

productRouter.post('/', auturizationMiddleware, createProduct);

productRouter.get('/',getProducts);

productRouter.get('/on-sale', getOnSaleProducts);
productRouter.put('/:productId/toggle-sale', auturizationMiddleware, toggleProductOnSale);

productRouter.delete('/:productId', auturizationMiddleware, deleteProduct);
 
productRouter.put('/:productId', auturizationMiddleware, updateProduct);

productRouter.get('/:productId',getProductById);

export default productRouter;