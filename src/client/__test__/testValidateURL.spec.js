import isURLValid from '../js/validateURL';


describe('Test validate url functionality', () =>{
    test('Test (is url valid) function', () => {
        expect(isURLValid).toBeDefined();
    });

    test('Test if the function return as expected "false" if entered invalid url', () => {
        expect(isURLValid('wrong url')).toBeFalsy();
    });

    test('Test if the function return as expected "true" if entered valid url', () => {
        expect(isURLValid('https://www.udacity.com/')).toBeTruthy();
    });
});