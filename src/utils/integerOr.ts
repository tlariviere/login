const integerOr = (
  value: string | undefined,
  defaultValue: number,
  radix = 10
): number => {
  if (value) {
    const num = parseInt(value, radix);
    if (Number.isFinite(num)) {
      return num;
    }
  }
  return defaultValue;
};

export default integerOr;
