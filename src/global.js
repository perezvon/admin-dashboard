/* eslint-disable */
import _ from 'underscore'

export function getCustomerGroupID(username) {
  switch(username) {
    case 'moorhead':
      return 1;
      break;
    case 'northmemorial':
      return 2;
      break;
    case 'healtheast':
      return 3;
      break;
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
        maxSpend: 500,
        filter: 'Shift'
      };
      break;
    case 2:
      return {
        companyName: 'North Memorial',
        logo: 'northmemorial.png',
        maxSpend: 1000
      }
      case 3:
        return {
          companyName: 'HealthEast',
          logo: 'healtheast.png',
          maxSpend: 250
        }
    default:
      return {
        companyName: '',
        logo: '',
        maxSpend: 0
      };
  }
}
