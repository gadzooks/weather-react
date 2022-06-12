import { icon_class } from "./icon"

describe('icon_class', () => {
    it('should show mapping for clear-day', () => {
        const result = icon_class('clear-day', 0, 0, 0);
        expect(result).toStrictEqual('');
    })
})