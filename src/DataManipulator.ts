import { ServerRespond } from './DataStreamer';

//Each row will have more values as we want more lines 
//(Such as upper and lower bound) to appear on our graph
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[1].top_bid.price) / 2; //Avg betwen ask and bid price for ABC
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2; //Avg betwen ask and bid price for DEF
    const ratio = priceABC / priceDEF; //Ratio of stock prices
    const upperBound = 1 + 0.06;  //Having a 6% margin of error for the upper and lower bounds led to more consistency, 
    const lowerBound = 1 - 0.06;  //thus we chose these values.
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound, //Upper bounr for vals
      lower_bound: lowerBound, //Lower bound for vals
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,  //The ratio for the upper or lower bound
    };
  }
}
