import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';
import { TicketServiceProxy } from 'src/ticket/ticket.service';

@Injectable()
export class SeatService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly ticketService: TicketServiceProxy) { }

  private availabilitySubjects: Map<number, Subject<any>> = new Map();
  private knownShowIds: Set<number> = new Set();
  private subscriberCount: Map<number, number> = new Map();
  private cleanupTimeouts: Map<number, NodeJS.Timeout> = new Map();

  private pollingInterval: NodeJS.Timeout;

  getSubject(showId: number): Subject<any> {
    if (!this.availabilitySubjects.has(showId)) {
      this.availabilitySubjects.set(showId, new Subject<any>());
      this.subscriberCount.set(showId, 0);
    }

    // Increment subscriber count
    const currentCount = this.subscriberCount.get(showId) ?? 0;
    this.subscriberCount.set(showId, currentCount + 1);

    // Cancel scheduled cleanup (if any)
    const timeout = this.cleanupTimeouts.get(showId);
    if (timeout) {
      clearTimeout(timeout);
      this.cleanupTimeouts.delete(showId);
    }

    // Ensure polling starts
    this.knownShowIds.add(showId);

    return this.availabilitySubjects.get(showId)!;
  }

  removeSubscriber(showId: number) {
    const current = (this.subscriberCount.get(showId) ?? 1) - 1;
    this.subscriberCount.set(showId, current);

    if (current <= 0) {
      // Schedule a delayed cleanup (e.g., 30 seconds)
      const timeout = setTimeout(() => {
        this.knownShowIds.delete(showId);
        this.availabilitySubjects.get(showId)?.complete();
        this.availabilitySubjects.delete(showId);
        this.subscriberCount.delete(showId);
        this.cleanupTimeouts.delete(showId);
      }, 30000); // Cleanup delay: 30 seconds

      this.cleanupTimeouts.set(showId, timeout);
    }
  }

  broadcast(showId: number, data: any) {
    const subject = this.availabilitySubjects.get(showId);
    if (subject) {
      subject.next(data);
    }
  }

  async fetchAndBroadcastAvailability(showId: number) {
    const availability = await this.ticketService.getShowSeatAvailability(
      showId,
    );
    this.broadcast(showId, availability);
  }

  onModuleInit() {
    this.pollingInterval = setInterval(async () => {
      for (const id of this.knownShowIds) {
        await this.fetchAndBroadcastAvailability(id);
      }
    }, 5000); // Poll every 20 seconds
  }

  onModuleDestroy() {
    clearInterval(this.pollingInterval);
  }
}
