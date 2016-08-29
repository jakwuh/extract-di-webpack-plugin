import './fixture';
import definitions from 'di-definitions';
import {expect} from 'chai';

describe('plugin', function() {

    it('extracts definitions', function() {
        expect(definitions).to.eql({
            A: ["B", {
                C: "E"
            }]
        });
    });

});
