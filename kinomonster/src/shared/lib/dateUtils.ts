export const getYearFromDate = (dateString?: string): string => {
  return dateString ? dateString.split('-')[0] : '';
};