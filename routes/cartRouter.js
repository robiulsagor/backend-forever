import express from "express";
import { addToCart, updateCart, getCart, deleteItem } from "../controllers/cartController.js";
import auth from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/addToCart", auth, addToCart);
cartRouter.post("/updateCart", auth, updateCart);
cartRouter.get("/getCart", auth, getCart);
cartRouter.post("/deleteItem", auth, deleteItem);


export default cartRouter;