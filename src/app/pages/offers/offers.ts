import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DEMO_OFFERS } from '../../data/demo-store';
import { Offer, OfferItem } from '../../services/offer';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Offers {
  private readonly offerService = inject(Offer);

  readonly offers = signal<OfferItem[]>(DEMO_OFFERS);
  readonly isLoading = signal(true);

  constructor() {
    this.loadOffers();
  }

  private loadOffers(): void {
    this.offerService
      .getOffers()
      .pipe(catchError(() => of(DEMO_OFFERS)))
      .subscribe((items) => {
        this.isLoading.set(false);

        if (items.length > 0) {
          this.offers.set(items);
        }
      });
  }
}
