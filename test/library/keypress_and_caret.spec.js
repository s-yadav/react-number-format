import React from 'react';
import NumberFormat from '../../src/number_format';

import {simulateKeyInput, simulateMousUpEvent, simulateFocusEvent, shallow} from '../test_util';

describe('Test character insertion', () => {
  it('should add any number properly when input is empty without format prop passed', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'}/>);

    simulateKeyInput(wrapper.find('input'), '1', 0);

    expect(wrapper.state().value).toEqual('$1');

    wrapper.setProps({value: ''});
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), '2456789', 0);

    expect(wrapper.state().value).toEqual('$2,456,789');
  });

  it('should add any number properly when input is empty with format prop passed', () => {
    //case 1: Enter first number
    const wrapper = shallow(<NumberFormat format="#### #### #### ####" mask="_"/>);
    simulateKeyInput(wrapper.find('input'), '1', 0);
    expect(wrapper.state().value).toEqual('1___ ____ ____ ____');

    //case 2: if nun numeric character got added
    wrapper.setProps({value: ''});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), 'b', 0);
    expect(wrapper.state().value).toEqual('');

    //case 3: Enter first multiple number
    wrapper.setProps({value: undefined});
    wrapper.setProps({value: ''});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '2456789', 0);
    expect(wrapper.state().value).toEqual('2456 789_ ____ ____');

    //case 4: When alpha numeric character got added
    wrapper.setProps({value: undefined});
    wrapper.setProps({value: ''});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '245sf6789', 0);
    expect(wrapper.state().value).toEqual('2456 789_ ____ ____');

    //case 5: Similiar to case 4 but a formatted value got added
    wrapper.setProps({value: undefined});
    wrapper.setProps({value: ''});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '1234 56', 0);
    expect(wrapper.state().value).toEqual('1234 56__ ____ ____');

    //case 6: If format has numbers
    wrapper.setProps({value: undefined});
    wrapper.setProps({value: '', format: '+1 (###) ### # ##'});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '123456', 0);
    expect(wrapper.state().value).toEqual('+1 (123) 456 _ __');

    //case 7: If format has numbers and and formatted value is inserted
    wrapper.setProps({value: undefined});
    wrapper.setProps({value: ''});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '+1 (965) 432 1 19', 0);
    expect(wrapper.state().value).toEqual('+1 (965) 432 1 19');
  });

  it('should handle addition of characters at a cursor position', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} value="$12,345"/>);
    let caretPos;
    const setSelectionRange = (pos) => {
      caretPos = pos;
    }

    simulateKeyInput(wrapper.find('input'), '8', 2, 2, setSelectionRange);
    expect(wrapper.state().value).toEqual('$182,345');
    expect(caretPos).toEqual(3);

    simulateKeyInput(wrapper.find('input'), '67', 3, 3, setSelectionRange);
    expect(wrapper.state().value).toEqual('$18,672,345');
    expect(caretPos).toEqual(6);

    wrapper.setProps({format: '### ### ###', value: '123 456 789'});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '8', 3, 3, setSelectionRange);
    expect(wrapper.state().value).toEqual('123 845 678');
    expect(caretPos).toEqual(5);


    simulateKeyInput(wrapper.find('input'), '999', 4, 4, setSelectionRange);
    expect(wrapper.state().value).toEqual('123 999 845');
    expect(caretPos).toEqual(7);
  });

})

describe('Test delete/backspace with format pattern', () => {
  const wrapper = shallow(<NumberFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US"/>);
  let caretPos;
  const setSelectionRange = (pos) => {
    caretPos = pos;
  }

  it('caret position should not change if its on starting of input area', () => {
    simulateKeyInput(wrapper.find('input'), 'Backspace', 4, 4, setSelectionRange);
    expect(wrapper.state().value).toEqual('+1 (123) 456 7 89 US');
    expect(caretPos).toEqual(4);
  });

  it('caret position should not change if its on end of input area', () => {
    simulateKeyInput(wrapper.find('input'), 'Delete', 17, 17, setSelectionRange);
    expect(wrapper.state().value).toEqual('+1 (123) 456 7 89 US');
    expect(caretPos).toEqual(17);
  });

  it('should only remove numbers only from input area in other case it should change the caret position', () => {
    simulateKeyInput(wrapper.find('input'), 'Backspace', 10, 10, setSelectionRange);
    expect(wrapper.state().value).toEqual('+1 (123) 567 8 9  US');
    expect(caretPos).toEqual(9);

    simulateKeyInput(wrapper.find('input'), 'Backspace', 9, 9, setSelectionRange);
    expect(wrapper.state().value).toEqual('+1 (123) 567 8 9  US');
    expect(caretPos).toEqual(7);

    simulateKeyInput(wrapper.find('input'), 'Delete', 7, 7, setSelectionRange);
    expect(wrapper.state().value).toEqual('+1 (123) 567 8 9  US');
    expect(caretPos).toEqual(9);

    simulateKeyInput(wrapper.find('input'), 'Delete', 9, 9, setSelectionRange);
    expect(wrapper.state().value).toEqual('+1 (123) 678 9    US');
    expect(caretPos).toEqual(9);
  });
})

describe('Test delete/backspace with numeric format', () => {
  const wrapper = shallow(<NumberFormat thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value="Rs. 12,345.50 /sq.feet"/>);
  let caretPos;
  const setSelectionRange = (pos) => {
    caretPos = pos;
  }

  it('should not remove prefix', () => {
    simulateKeyInput(wrapper.find('input'), 'Backspace', 4, 4, setSelectionRange);
    expect(wrapper.state().value).toEqual('Rs. 12,345.50 /sq.feet');
    expect(caretPos).toEqual(4);
  });

  it('should not remove suffix', () => {
    simulateKeyInput(wrapper.find('input'), 'Delete', 13, 13, setSelectionRange);
    expect(wrapper.state().value).toEqual('Rs. 12,345.50 /sq.feet');
    expect(caretPos).toEqual(13);
  });

  it('should only remove number, in other case it should change caret position', () => {
    simulateKeyInput(wrapper.find('input'), 'Backspace', 7, 7, setSelectionRange);
    expect(wrapper.state().value).toEqual('Rs. 12,345.50 /sq.feet');
    expect(caretPos).toEqual(6);

    simulateKeyInput(wrapper.find('input'), 'Delete', 6, 6, setSelectionRange);
    expect(wrapper.state().value).toEqual('Rs. 12,345.50 /sq.feet');
    expect(caretPos).toEqual(7);

    simulateKeyInput(wrapper.find('input'), 'Backspace', 8, 8, setSelectionRange);
    expect(wrapper.state().value).toEqual('Rs. 1,245.50 /sq.feet');
    expect(caretPos).toEqual(7);

    simulateKeyInput(wrapper.find('input'), 'Delete', 7, 7, setSelectionRange);
    expect(wrapper.state().value).toEqual('Rs. 125.50 /sq.feet');
    expect(caretPos).toEqual(6);
  });

  it('should maintain correct caret positon while removing the last character and suffix is not defined. Issue #105', () => {
    wrapper.setProps({
      suffix: '',
      prefix: '$',
      value: '$2,342,343'
    });
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), 'Backspace', 10, 10, setSelectionRange);
    expect(wrapper.state().value).toEqual('$234,234');
    expect(caretPos).toEqual(8);
  })

  it('should maintain correct caret position while removing the second last character and suffix is not defined, Issue #116', () => {
    wrapper.setProps({
      suffix: '',
      prefix: '',
      value: '1,000'
    });
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), 'Backspace', 4, 4, setSelectionRange);
    expect(wrapper.state().value).toEqual('100');
    expect(caretPos).toEqual(2);
  })
})

describe('Test arrow keys', () => {
  let caretPos;
  const setSelectionRange = (pos) => {
    caretPos = pos;
  }

  it('should keep caret position between the prefix and suffix', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value="Rs. 12,345.50 /sq.feet"/>);
    simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 4, 4, setSelectionRange);
    expect(caretPos).toEqual(4);

    simulateKeyInput(wrapper.find('input'), 'ArrowRight', 13, 13, setSelectionRange);
    expect(caretPos).toEqual(13);
  })

  it('should keep caret position within typable area', () => {
    const wrapper = shallow(<NumberFormat  format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US"/>);
    simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 4, 4, setSelectionRange);
    expect(caretPos).toEqual(4);

    simulateKeyInput(wrapper.find('input'), 'ArrowRight', 17, 17, setSelectionRange);
    expect(caretPos).toEqual(17);

    simulateKeyInput(wrapper.find('input'), 'ArrowRight', 7, 7, setSelectionRange);
    expect(caretPos).toEqual(9);

    simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 9, 9, setSelectionRange);
    expect(caretPos).toEqual(7);

    caretPos = undefined;
    simulateKeyInput(wrapper.find('input'), 'ArrowRight', 12, 12, setSelectionRange);
    expect(caretPos).toEqual(13);

    caretPos = undefined;
    simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 13, 13, setSelectionRange);
    expect(caretPos).toEqual(12);
  });
})

describe('Test click / focus on input', () => {
  let caretPos;
  const setSelectionRange = (pos) => {
    caretPos = pos;
  }

  it('should always keep caret on typable area when we click on the input', () => {
    const wrapper = shallow(<NumberFormat  format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US"/>);

    simulateMousUpEvent(wrapper.find('input'), 0, setSelectionRange);
    expect(caretPos).toEqual(4);

    simulateMousUpEvent(wrapper.find('input'), 8, setSelectionRange);
    expect([7, 9]).toContain(caretPos);

    simulateMousUpEvent(wrapper.find('input'), 19, setSelectionRange);
    expect(caretPos).toEqual(17);
  })

  it('should limit the caret position to the next position of the typed number', () => {
    const wrapper = shallow(<NumberFormat format="##/##/####"/>);

    simulateKeyInput(wrapper.find('input'), '1', 0);
    expect(wrapper.state().value).toEqual('1 /  /    ');

    simulateMousUpEvent(wrapper.find('input'), 4, setSelectionRange);
    expect(caretPos).toEqual(1);

    wrapper.setProps({
      mask: ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']
    })
    wrapper.update();

    expect(wrapper.state().value).toEqual('1D/MM/YYYY');
    simulateMousUpEvent(wrapper.find('input'), 4, setSelectionRange);
    expect(caretPos).toEqual(1);
  })

  it('should always keep caret position between suffix and prefix', () => {
    const wrapper = shallow(<NumberFormat  thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value="Rs. 12,345.50 /sq.feet"/>);

    simulateMousUpEvent(wrapper.find('input'), 0, setSelectionRange);
    expect(caretPos).toEqual(4);

    simulateMousUpEvent(wrapper.find('input'), 17, setSelectionRange);
    expect(caretPos).toEqual(13);
  })

  it('should correct wrong caret position on focus', () => {
    jasmine.clock().install()
    const wrapper = shallow(<NumberFormat  thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value="Rs. 12,345.50 /sq.feet"/>);

    simulateFocusEvent(wrapper.find('input'), 0, setSelectionRange);
    jasmine.clock().tick(1)
    expect(caretPos).toEqual(4)
    jasmine.clock().uninstall()
  });

  it('should not reset correct caret position on focus', () => {
    jasmine.clock().install()
    const wrapper = shallow(<NumberFormat  thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value="Rs. 12,345.50 /sq.feet"/>);

    // Note: init caretPos to `6`. Focus to `6`. In case of bug, selectionStart is `0` and the caret will move to `4`.
    //   otherwise (correct behaviour) the value will not change, and stay `6`
    caretPos = 6
    simulateFocusEvent(wrapper.find('input'), 6, setSelectionRange);
    jasmine.clock().tick(1)
    expect(caretPos).toEqual(6)
    jasmine.clock().uninstall()
  });
});
