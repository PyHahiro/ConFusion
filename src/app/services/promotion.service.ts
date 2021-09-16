import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }


  getPromotions(): Promise<Promotion[]> {
    return new Promise(resolve => {
      // simulate server latency with 1 second delay
      setTimeout(() => resolve(PROMOTIONS), 1000);
    });
  }


  getPromotion(id: string): Promise<Promotion> {
    return new Promise(resolve => {
      setTimeout(() => resolve(PROMOTIONS.filter((promotion) => (promotion.id === id))[0]), 1000);
   });
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return new Promise(resolve => {
   // Simulate server latency with 2 second delay
   setTimeout(() => resolve(PROMOTIONS.filter((promotion) => promotion.featured)[0]), 1000);
    });
  }
}

