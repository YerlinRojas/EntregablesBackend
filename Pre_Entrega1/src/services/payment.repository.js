import Stripe from 'stripe'


const key = 'sk_test_51OHAXYGKzTAHQyjNZoSpRcdomWh48xJZq3HyigHAYwdsvc4XO8r8i1Cvyp0voBHeONT8MFMHM876WhkPAdmrYzhO00jeFiFLBl'

/* const stripe = new Stripe(key)
export const createSession = (req, res) => {
    stripe.checkout.sessions.create({
        
    })
} */


export default class PaymentServices{
    constructor() {
        this.stripe = new Stripe(key)
    }
    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}