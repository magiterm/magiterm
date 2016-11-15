import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
// import App from '../app/components/App';
import Login from '../../../app/components/Login';

describe("Login component", function() {

  it("has homepage container div", function() {
    const wrapper = shallow(<Login/>);
    expect(wrapper.find('form')).to.have.length(1);
  });

  // it("contains spec with an expectation", function() {
  //   expect(shallow(<Foo />).is('.foo')).to.equal(true);
  // });

  // it("contains spec with an expectation", function() {
  //   expect(mount(<Foo />).find('.foo').length).to.equal(1);
  // });
});
