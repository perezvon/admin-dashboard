/* eslint-disable */
import _ from 'underscore'

export function getCustomerGroupID(username) {
  switch(username) {
    default:
      return 0;
  }
}

export function currToNumber(string) {
  return Number(string.replace(/[^0-9\.]+/g, ""))
}

export function sortCollection(collection, sortBy, reverseFlag) {
  if (reverseFlag) return _.sortBy(collection, sortBy).reverse();
  else return _.sortBy(collection, sortBy);
}

export function getCompanyInfo(id) {
  switch(id) {
    case 1:
      return {
        companyName: 'Moorhead Fire',
        logo: 'moorheadlogo.png',
        maxSpend: 500
      };
      break;
    case 2:
      return {
        companyName: 'Awesomeco Inc',
        logo: '',
        maxSpend: 10000
      }
    default:
      return {
        companyName: '',
        logo: '',
        maxSpend: 0
      };
  }
}
