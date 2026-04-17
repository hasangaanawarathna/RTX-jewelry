import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, ProductItem } from '../../services/product';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly productService = inject(Product);

  readonly featuredJewelry = signal<ProductItem[]>([
    {
      name: 'Royal Gold Necklace',
      category: 'Necklace',
      description: 'A bold necklace crafted for special celebrations and modern elegance.',
      imageUrl: null,
      price: 'LKR 185,000'
    },
    {
      name: 'Diamond Bloom Ring',
      category: 'Ring',
      description: 'Floral-inspired ring design with a bright premium finish.',
      imageUrl: null,
      price: 'LKR 98,000'
    },
    {
      name: 'Pearl Grace Earrings',
      category: 'Earrings',
      description: 'Lightweight pearl earrings with timeless detail and daily comfort.',
      imageUrl: null,
      price: 'LKR 64,500'
    }
  ]);

  readonly offerHighlights = signal([
    {
      title: 'Festival Gold Week',
      summary: 'Up to 15% off selected gold collections this week.'
    },
    {
      title: 'Bridal Set Savings',
      summary: 'Special bundle pricing on matching bridal sets.'
    }
  ]);

  readonly specialOffers = signal([
    {
      title: 'Akshaya Tritiya Gold Sale',
      summary: 'Enjoy reduced making charges on selected 22K gold items this weekend.',
      discount: 'Save up to LKR 18,000',
      validUntil: 'Valid until Sunday',
      code: 'AKSHAYA2026'
    },
    {
      title: 'Wedding Collection Bundle',
      summary: 'Get special pricing when you buy matching necklace, earrings, and bangles.',
      discount: 'Bundle savings 12%',
      validUntil: 'Limited bridal season offer',
      code: 'BRIDAL12'
    },
    {
      title: 'Diamond Ring Upgrade',
      summary: 'Trade in your old ring and receive extra value toward a certified diamond ring.',
      discount: 'Extra LKR 25,000 value',
      validUntil: 'This month only',
      code: 'UPGRADE25'
    }
  ]);

  readonly feedbackPreview = signal([
    {
      name: 'Nethmi',
      message: 'Excellent craftsmanship and very professional service.'
    },
    {
      name: 'Ishan',
      message: 'The design consultation was smooth and personalized.'
    }
  ]);

  constructor() {
    this.loadFeaturedJewelry();
  }

  private loadFeaturedJewelry(): void {
    this.productService.getFeaturedProducts()
      .pipe(catchError(() => of([])))
      .subscribe((items) => {
        if (items.length > 0) {
          this.featuredJewelry.set(items);
        }
      });
  }
}
