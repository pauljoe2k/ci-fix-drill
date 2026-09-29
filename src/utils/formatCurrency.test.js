const { formatCurrency } = require('./formatCurrency');

test('formats currency correctly', () => {
  // toBe checks object identity; compare the returned object's values instead.
  expect(formatCurrency(10.005, 'USD')).toEqual({ amount: 10.01, currency: 'USD' });
});
