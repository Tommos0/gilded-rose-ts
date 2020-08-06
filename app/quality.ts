import { clamp } from './utils';
import { ConjuredItem, Item, ItemName } from './gilded-rose';

type QualityFunc = (item: Item) => number;

// clamp between 0,50
const clampFunc = (f: QualityFunc) => (item) => clamp(0, 50)(f(item));

const nextQualityPass: QualityFunc = (item) => {
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

export const nextQuality: QualityFunc = (item) => {
    const sDefault = Symbol();

    const itemNameQualityFuncMap = {
        [ItemName.Brie]: clampFunc((item) => item.quality + (item.sellIn <= 0 ? 2 : 1)),
        [ItemName.Pass]: clampFunc(nextQualityPass),
        [ItemName.Sulfuras]: (_) => 80,
        [sDefault]: clampFunc((item) => item.quality - (item.sellIn > 0 ? 1 : 2)),
    };

    let quality = (itemNameQualityFuncMap[item.name] || itemNameQualityFuncMap[sDefault])(item);

    // let conjured items degrade 2* as fast
    if (item instanceof ConjuredItem && quality < item.quality) {
        quality = clamp(0, 50)(2 * quality - item.quality);
    }

    return quality;
};
