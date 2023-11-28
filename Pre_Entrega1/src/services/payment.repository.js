import Stripe from 'stripe'

const key = 'sk_test_51OHAlUFcLrMcDXDVSBCC2N6QvPb0EjunPDxm9P7EyFcGfSH9yp1j7Asg1DfRICpGVePlPAM72ElAj4X2IsNdadzT00ubf5CycI'

export default class PaymentServices{
    constructor() {
        this.stripe = new Stripe(key)
    }
    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}