import CartModel from '../dao/mongo/models/cart.model.js'

export default class Cart{
    cartList= async()=>{
        return await CartModel.find()
    }
    createCart = async()=>{
        return await CartModel.create({})
    }
    cartById= async(cid)=>{
   
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ error: "ID de carrito no válido" });
      }
        return await CartModel.findOne({_id:cid})
    }
    saveCart= async(cart)=>{
        return await cart.save()
    }
    
    updatedCart= async(cid, updatedFields)=>{
        return await CartModel.updateOne({_id:cid}, updatedFields);
    }

    deleteCart= async (cid) => {
        return await CartModel.deleteOne({_id:cid})
    }

    

}