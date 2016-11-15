import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
// import App from '../app/components/App';
import SignUp from '../../../app/components/SignUp';

describe("SignUp component", function() {

  it("has form element", function() {
    const wrapper = shallow(<SignUp/>);
    expect(wrapper.find('form')).to.have.length(1);
  });

  // it("contains spec with an expectation", function() {
  //   expect(shallow(<Foo />).is('.foo')).to.equal(true);
  // });

  // it("contains spec with an expectation", function() {
  //   expect(mount(<Foo />).find('.foo').length).to.equal(1);
  // });
});
