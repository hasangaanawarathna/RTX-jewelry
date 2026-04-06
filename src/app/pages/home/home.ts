import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  readonly featuredJewelry = signal([
    {
      name: 'Royal Gold Necklace',
      category: 'Necklace',
      description: 'A bold necklace crafted for special celebrations and modern elegance.',
      image: 'assets/jewelry/royal-gold-necklace.svg',
      price: 'LKR 185,000'
    },
    {
      name: 'Diamond Bloom Ring',
      category: 'Ring',
      description: 'Floral-inspired ring design with a bright premium finish.',
      image: 'assets/jewelry/diamond-bloom-ring.svg',
      price: 'LKR 98,000'
    },
    {
      name: 'Pearl Grace Earrings',
      category: 'Earrings',
      description: 'Lightweight pearl earrings with timeless detail and daily comfort.',
      image: 'assets/jewelry/pearl-grace-earrings.svg',
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
}
