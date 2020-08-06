import { expect } from 'chai';
import * as fs from 'fs';

describe('Golden master text', function () {
    const expected = fs.readFileSync(__dirname + '/fixtures/golden_master.txt', 'ascii');

    it('should equal the fixture', async function () {
        // monkey patch console.log to catch the output
        const oldLog = console.log;
        let log = '';
        console.log = (text) => (log = log + (text || '') + '\n');
        await import('./golden-master-text-test');
        console.log = oldLog;

        expect(log).to.equal(expected);
    });
});
