import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
// import App from '../app/components/App';
import CodeEditor from '../../../app/components/CodeEditor';

function incrementStoredData(value, amount){
  var total = store.get(value) || 0;
  var newtotal = total + amount;
  store.set(value, newtotal);
}

describe("CodeEditor component", function() {
  
  xit("has textarea element", function() {
    // if you run this right now you'll get this error
    // ReferenceError: sessionStorage is not defined    
    // waiting for sessionStorage to removed before running this test
    const wrapper = shallow(<CodeEditor/>);
    expect(wrapper.find('textarea')).to.have.length(1);
  });

  // it("contains spec with an expectation", function() {
  //   expect(shallow(<Foo />).is('.foo')).to.equal(true);
  // });

  // it("contains spec with an expectation", function() {
  //   expect(mount(<Foo />).find('.foo').length).to.equal(1);
  // });
});
