import { Router} from 'express'
import PaymentServices from '../services/payment.repository.js';

const router = Router ()

//render ACA SE ESTA REDEN
router.get ('/', async(req,res)=>{
res.render('payment', {key:'pk_test_51OHAXYGKzTAHQyjNieBv9K3JN8nDYgsrjvN8kxgztqs2g0rhcxSl5LkOiyv6zzEHjVUhq4UwXcnukCfasyDoCb7v00B3b0PpSN'})
})



 //payment intens 
router.post('/payment-intens', async (req, res) => {
    //const cid = req.params.cid;
    const amount = req.body.amount;
    //const cart = await cartService.cartById(cid);

    console.log('Amount:', amount);
    //console.log('CID:', cid);

    const paymentIntensInfo = {
        amount: amount,
        currency : 'usd',
        payment_method_types : ['card']

    }

    const paymentService = new PaymentServices()
    const result = await paymentService.createPaymentIntent(paymentIntensInfo)

    console.log(result);
    return res.send({status: "success", payload: result})
});


export default router;
