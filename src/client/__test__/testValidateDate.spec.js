import isURLValid from "../js/validateURL";
import isDateValid from "../js/validateDate";


describe('Test validate url functionality', () =>{
    test('Test (is url valid) function', () => {
        expect(isDateValid).toBeDefined();
    });

    test('Test if the function return as expected "false" if entered invalid date [PAST START DATE]', () => {
        expect(isDateValid('2000-11-11', '2001-11-11')).toBeFalsy();
    });

    test('Test if the function return as expected "false" if entered invalid date [END DATE BEFORE START DATE]', () => {
        expect(isDateValid('2021-11-11', '2021-10-10')).toBeFalsy();
    });

    test('Test if the function return as expected "true" if entered valid date', () => {
        expect(isDateValid('2021-10-10', '2021-11-11')).toBeTruthy();
    });
});