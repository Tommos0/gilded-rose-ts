import { expect } from 'chai';
import { ConjuredItem, Item, ItemName, updateItem } from '../app/gilded-rose';

describe('At the end of each day our system lowers both values for every item', () => {
    let item: Item;
    const startSellIn = 6;
    const startQuality = 7;
    beforeEach(() => {
        item = new Item('a thing', startSellIn, startQuality);
    });

    it('decreases quality', () => {
        updateItem(item);
        expect(item.quality).to.equal(startQuality - 1);
    });
    it('decreases sellIn', () => {
        updateItem(item);
        expect(item.sellIn).to.equal(startSellIn - 1);
    });
});

describe('Once the sell by date has passed, Quality degrades twice as fast', () => {
    let item: Item;
    const startSellIn = 2;
    const startQuality = 10;

    beforeEach(() => {
        item = new Item('a thing', startSellIn, startQuality);
    });

    it('decreases quality by 1 at first', () => {
        updateItem(item);
        expect(item.quality).to.equal(startQuality - 1);
    });
    it('decreases quality by 2 after sell by date passed', () => {
        updateItem(item); // -1
        updateItem(item); // -1
        updateItem(item); // -2
        expect(item.quality).to.equal(startQuality - 4);
    });
});

describe('The Quality of an item is never negative', () => {
    const items = [
        new Item('a', 2, 10),
        new Item('a', 4, 2),
        new Item('a', 3, 9),
        new Item('a', 4, 10),
    ];

    for (const item of items) {
        it('quality stays above 0 ' + JSON.stringify(item), () => {
            for (let i = 0; i < 10; i++) {
                updateItem(item);
            }
            expect(item.quality).to.be.gte(0);
        });
    }
});

describe('"Aged Brie" actually increases in Quality the older it gets', () => {
    // also increase doubly after sellIn.
    const items = [
        new Item(ItemName.Brie, 2, 10),
        new Item(ItemName.Brie, 4, 2),
        new Item(ItemName.Brie, 3, 9),
        new Item(ItemName.Brie, 4, 10),
    ];

    const days = 10;

    for (const item of items) {
        it('quality increases by one every day (and 2 after sellIn)' + JSON.stringify(item), () => {
            for (let i = 0; i < days; i++) {
                const lastDayQuality = item.quality;
                updateItem(item);
                if (item.sellIn >= 0) {
                    expect(item.quality).to.equal(lastDayQuality + 1);
                } else {
                    expect(item.quality).to.equal(lastDayQuality + 2);
                }
            }
        });
    }
});

describe('The Quality of an item is never more than 50', () => {
    const items = [
        new Item(ItemName.Brie, 2, 10),
        new Item(ItemName.Brie, 4, 2),
        new Item(ItemName.Brie, 3, 9),
        new Item(ItemName.Brie, 4, 10),
    ];

    const days = 100;

    for (const item of items) {
        it('quality never above 50' + JSON.stringify(item), () => {
            for (let i = 0; i < days; i++) {
                updateItem(item);
                expect(item.quality).to.be.lte(50);
            }
        });
    }
    it('brie quality === 50 after many days', () => {
        for (const item of items) {
            expect(item.quality).to.equal(50);
        }
    });
});

describe('"Sulfuras", being a legendary item, never has to be sold or decreases in Quality', () => {
    // "Sulfuras" is a legendary item and as such its Quality is 80 and it never alters.

    const items = [
        new Item(ItemName.Sulfuras, 10, 80),
        new Item(ItemName.Sulfuras, 10, 80),
        new Item(ItemName.Sulfuras, 10, 80),
        new Item(ItemName.Sulfuras, 10, 80),
    ];

    const days = 100;

    it('quality stays 80', () => {
        for (const item of items) {
            for (let i = 0; i < days; i++) {
                updateItem(item);
                expect(item.quality).to.equal(80);
            }
        }
    });
});

describe('Backstage pass', () => {
    const items = [
        new Item(ItemName.Pass, 12, 5),
        new Item(ItemName.Pass, 4, 2),
        new Item(ItemName.Pass, 9, 9),
        new Item(ItemName.Pass, 13, 1),
        new Item(ItemName.Pass, 29, 75),
    ];

    const days = 100;

    it('follows the rules', () => {
        for (const item of items) {
            for (let i = 0; i < days; i++) {
                const lastDaySellIn = item.sellIn;
                const lastDayQuality = item.quality;
                updateItem(item);

                // an item can never have its Quality increase above 50
                expect(item.quality).to.be.lte(50);

                let expectedQuality = lastDayQuality + 1;

                if (lastDaySellIn <= 0) {
                    // Quality drops to 0 after the concert
                    expectedQuality = 0;
                } else if (lastDaySellIn <= 5) {
                    // Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less
                    expectedQuality = lastDayQuality + 3;
                } else if (lastDaySellIn <= 10) {
                    // Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less
                    expectedQuality = lastDayQuality + 2;
                }
                expect(item.quality).to.equal(Math.min(50, expectedQuality));
            }
        }
    });
});

describe('"Conjured" items degrade in Quality twice as fast as normal items', () => {
    const items = [
        new ConjuredItem('a', 2, 10),
        new ConjuredItem('a', 4, 2),
        new ConjuredItem('a', 3, 9),
        new ConjuredItem('a', 4, 10),
        new ConjuredItem('a', 4, 10),
    ];

    const days = 100;

    it('degrades 2x as fast', () => {
        for (const item of items) {
            for (let i = 0; i < days; i++) {
                const lastDaySellIn = item.sellIn;
                const lastDayQuality = item.quality;
                updateItem(item);
                if (lastDaySellIn > 0) {
                    expect(item.quality).to.equal(Math.max(0, lastDayQuality - 2));
                } else {
                    expect(item.quality).to.equal(Math.max(0, lastDayQuality - 4));
                }
            }
        }
    });
});
