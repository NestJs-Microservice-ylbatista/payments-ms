/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(envs.stripeSecret);


    async createPaymentSession( paymentSessionDto: PaymentSessionDto ){ 
        //desectructuro la data recibida y creo el pago
        const { currency, items, orderId } = paymentSessionDto;

        const lineItems = items.map( item => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round( item.price * 100 ),  //20 usd  2000 / 100
                },
                quantity: item.quantity
            };
        });

        //informacion de lo que queremos cobrar
        const session = await this.stripe.checkout.sessions.create({
            
            //colocar aqui id de orden
            payment_intent_data: {
                metadata: {
                    orderId: orderId
                }
            },

            line_items: lineItems,
            mode: 'payment',
            success_url: envs.stripeSuccess,
            cancel_url: envs.stripeCancel,

        });

        return session;
    }




    async stripeWebhook( request: Request, response: Response ) {
        const sig = request.headers['stripe-signature'];
        // console.log({'sig':sig});
        
        //Testing
        // const endpointSecret = "whsec_e995c09b9719a124341158bd3ff695c8f412e5d5879dd76f6e97c4886dd0878f";

        //Real
        const endpointSecret = envs.stripeEndPointSecret;

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(request['rawBody'], sig, endpointSecret);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        
        // console.log({event});

        switch(event.type) {
            case 'charge.succeeded':
                const chargeSucceded = event.data.object as Stripe.Charge;
                // console.log({charge});

                //TODO: llamar a microservicio
                console.log({
                    metadata: chargeSucceded.metadata,
                    orderId: chargeSucceded.metadata.orderId
                });
                
            break;


            default:
                console.log(`Event ${event.type} not handled`);
                
        }
        

        return response.status(200).json({ sig })
    }

    
}
