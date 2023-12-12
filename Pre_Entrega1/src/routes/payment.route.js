import { Router} from 'express'
import config from "../config/config.js";


import PaymentServices from '../services/payment.repository.js';

const router = Router ()

//render ACA SE ESTA REDEN
router.get ('/', async(req,res)=>{
res.render('payment', {key:config.STRIPE_PUBLIC})
})

 //payment intens 
 router.post('/payment-intens', async (req, res) => {
    const amount = req.body.amount;
    
    //const cid = req.params.cid;
    //const cart = await cartService.cartById(cid);
    //console.log('CID:', cid);

    console.log('Amount:', amount);

    const paymentIntensInfo = {
        amount: amount,
        currency : 'usd',
        payment_method_types : ['card'],
    }

    const paymentService = new PaymentServices()
    const result = await paymentService.createPaymentIntent(paymentIntensInfo)

    console.log(result);
    return res.send(result)
});
  
export default router;
