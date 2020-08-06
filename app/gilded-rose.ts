import { nextQuality } from './quality';

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }

    update(): void {
        this.quality = nextQuality(this);

        if (this.name != ItemName.Sulfuras) {
            this.sellIn = this.sellIn - 1;
        }
    }
}

export class ConjuredItem extends Item {}

export enum ItemName {
    Brie = 'Aged Brie',
    Pass = 'Backstage passes to a TAFKAL80ETC concert',
    Sulfuras = 'Sulfuras, Hand of Ragnaros',
}

export class GildedRose {
    constructor(public items: Item[] = []) {}

    updateQuality(): Item[] {
        this.items.forEach((item) => item.update());
        return this.items;
    }
}
