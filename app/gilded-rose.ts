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

export class ConjuredItem extends Item {
    conjured = true;
}

function isConjuredItem(item: Item): item is ConjuredItem {
    return (item as any).conjured;
}

export enum ItemName {
    Brie = 'Aged Brie',
    Pass = 'Backstage passes to a TAFKAL80ETC concert',
    Sulfuras = 'Sulfuras, Hand of Ragnaros',
}

type qualityFunc = (item: Item) => number;

const nextQualityPass: qualityFunc = (item) => {
    if (item.sellIn <= 0) {
        return 0;
    }
    if (item.sellIn <= 5) {
        return item.quality + 3;
    }
    if (item.sellIn <= 10) {
        return item.quality + 2;
    }
    return item.quality + 1;
};

// clamp between 0,50
const clamp = (f: qualityFunc) => (item) => Math.max(0, Math.min(50, f(item)));

export const nextQuality: qualityFunc = (item) => {
    const sDefault = Symbol();

    const itemNameQualityFuncMap = {
        [ItemName.Brie]: clamp((item) => item.quality + (item.sellIn <= 0 ? 2 : 1)),
        [ItemName.Pass]: clamp(nextQualityPass),
        [ItemName.Sulfuras]: (_) => 80,
        [sDefault]: clamp((item) => item.quality - (item.sellIn > 0 ? 1 : 2)),
    };

    return (itemNameQualityFuncMap[item.name] || itemNameQualityFuncMap[sDefault])(item);
};

export const updateItem: (item: Item) => void = (item) => {
    item.quality = nextQuality(item);

    if (item.name != ItemName.Sulfuras) {
        item.sellIn = item.sellIn - 1;
    }
};

export class GildedRose {
    constructor(public items: Item[] = []) {}

    updateQuality(): Item[] {
        this.items.forEach(updateItem);
        return this.items;
    }
}
