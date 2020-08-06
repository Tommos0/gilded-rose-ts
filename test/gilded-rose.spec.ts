import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose', function () {
    it('should foo', function () {
        const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
        const items = gildedRose.updateQuality();
        expect(items[0].name).to.equal('foo');
    });
    it('should be constructable with no arguments', function () {
        const gildedRose = new GildedRose();
        gildedRose.updateQuality();
        expect(gildedRose).to.be.instanceOf(GildedRose);
    });
});
