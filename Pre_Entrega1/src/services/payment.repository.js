import Stripe from 'stripe'
import config from "../config/config.js";


export default class PaymentServices{
    constructor() {
        this.stripe = new Stripe(config.STRIPE_PRIVATE)
    }
    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
} 