export const isInteger = (value: string): boolean => {
  return Number.isInteger(Number(value)) && Number(value) > 0;
};
