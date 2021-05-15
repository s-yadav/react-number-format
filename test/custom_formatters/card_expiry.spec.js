import {cardExpiry} from '../../custom_formatters/card_expiry';

describe ('Test card expiry formatter', () => {
  it('should format number in format of MM/YY', () => {
    expect(cardExpiry('1123')).toEqual('11/23');
    expect(cardExpiry('11234')).toEqual('11/23');
    expect(cardExpiry('112')).toEqual('11/2');
    expect(cardExpiry('11')).toEqual('11');
  });

  it('should format input to valid MM/YY', () => {
    expect(cardExpiry('2')).toEqual('02');
    expect(cardExpiry('00')).toEqual('01');
    expect(cardExpiry('0200')).toEqual('02/00');
    expect(cardExpiry('024')).toEqual('02/4');
    expect(cardExpiry('1410')).toEqual('12/10');
    expect(cardExpiry('1235')).toEqual('12/35');
  });
})
