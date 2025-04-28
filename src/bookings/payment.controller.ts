import { Controller, Post, Req, Headers } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { RawBodyRequest } from '@nestjs/common/interfaces';
import Stripe from 'stripe';

@Controller('bookings')
export class PaymentController {
  private readonly stripe: Stripe;

  constructor(private readonly bookingsService: BookingsService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      if (!signature) {
        throw new Error('No Stripe signature found');
      }

      if (!request.rawBody) {
        throw new Error('No raw body found');
      }

      console.log('Received webhook', {
        signature,
        rawBodyLength: request.rawBody.length,
      });

      let event: Stripe.Event;

      try {
        event = this.stripe.webhooks.constructEvent(
          request.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        throw new Error(`Webhook Error: ${err.message}`);
      }

      // Return early to acknowledge receipt
      this.handleWebhookAsync(event);

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  private async handleWebhookAsync(event: Stripe.Event) {
    try {
      console.log('Processing webhook event:', {
        type: event.type,
        id: event.id,
      });

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Processing successful payment:', paymentIntent.id);
          await this.bookingsService.handleSuccessfulPayment(paymentIntent);
          console.log('Successfully processed payment:', paymentIntent.id);
          break;

        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Processing failed payment:', failedPaymentIntent.id);
          await this.bookingsService.handleFailedPayment(failedPaymentIntent);
          console.log('Successfully processed failed payment:', failedPaymentIntent.id);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
      // You might want to add retry logic or error reporting here
    }
  }
}
