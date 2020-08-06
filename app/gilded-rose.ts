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
    return (item as ConjuredItem).conjured;
}

export enum ItemName {
    Brie = 'Aged Brie',
    Pass = 'Backstage passes to a TAFKAL80ETC concert',
    Sulfuras = 'Sulfuras, Hand of Ragnaros',
}

type qualityFunc = (item: Item) => number;

const clamp = (min: number, max: number) => (n: number) => Math.max(min, Math.min(max, n));

// clamp between 0,50
const clampFunc = (f: qualityFunc) => (item) => clamp(0, 50)(f(item));

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

export const nextQuality: qualityFunc = (item) => {
    const sDefault = Symbol();

    const itemNameQualityFuncMap = {
        [ItemName.Brie]: clampFunc((item) => item.quality + (item.sellIn <= 0 ? 2 : 1)),
        [ItemName.Pass]: clampFunc(nextQualityPass),
        [ItemName.Sulfuras]: (_) => 80,
        [sDefault]: clampFunc((item) => item.quality - (item.sellIn > 0 ? 1 : 2)),
    };

    let quality = (itemNameQualityFuncMap[item.name] || itemNameQualityFuncMap[sDefault])(item);

    // let conjured items degrade 2* as fast
    if (isConjuredItem(item) && quality < item.quality) {
        quality = clamp(0, 50)(2 * quality - item.quality);
    }

    return quality;
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
