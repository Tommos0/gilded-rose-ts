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
}

export function updateItem(item: Item): void {
    item.quality = nextQuality(item);

    if (item.name != ItemName.Sulfuras) {
        item.sellIn = item.sellIn - 1;
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
        this.items.forEach(updateItem);
        return this.items;
    }
}
