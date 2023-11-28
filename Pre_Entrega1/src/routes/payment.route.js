import { Router} from 'express'
import { cartService } from '../services/index.js';
import PaymentServices from '../services/payment.repository.js';

const router = Router ()

//payment intens 
router.post('/payment-intens/:cid', async (req, res) => {
    const cid = req.params.cid;
    const amount = req.body.amount;
    const cart = await cartService.cartById(cid);
    console.log('Amount:', amount);
    console.log('CID:', cid);

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
