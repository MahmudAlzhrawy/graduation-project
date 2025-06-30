const convertToSubCurrency = (amount: number, factor = 60) => {
  return Math.round(amount * factor);
};
export default convertToSubCurrency;
