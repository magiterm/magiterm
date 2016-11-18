import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import { spy } from 'sinon';
import SignUp from '../../../app/components/SignUp';

describe("SignUp component", function() {
  // var wrapper;
  before(function(done) {
    done();
  });

  it("should exist", function() {
    const wrapper = shallow(<SignUp/>);
    expect(wrapper).to.exist;
  });

  it("should have form element", function() {
    const wrapper = shallow(<SignUp/>);
    expect(wrapper.find('form')).to.have.length(1);
  });

  it("should have input fields", function() {
    const wrapper = shallow(<SignUp/>);
    expect(wrapper.find('input')).to.have.length(5);
    expect(wrapper.find('#username')).to.have.length(1);
    expect(wrapper.find('#password')).to.have.length(1);
    expect(wrapper.find('#firstname')).to.have.length(1);
    expect(wrapper.find('#lastname')).to.have.length(1);
    expect(wrapper.find('#email')).to.have.length(1);
  });

  // it('should call onsubmit', () => {
  //   const test = spy();
  //   const loginComponent = mount(<SignUp onSubmit={test} /> );
  //   loginComponent.find('button').simulate('submit');
  //   expect(onSubmit.calledOnce).to.equal(true);
  // });

  // it("show error when clicking on submit without filling any fields", function() {
  //   const callback = spy();

  //   const wrapper = mount(
  //     // <button onButtonClick={onButtonClick}/>
  //     <SignUp onSubmit={callback} />
  //   );
  //   expect(wrapper.find('#username')).to.have.length(1);
  //   expect(wrapper.find('#submit')).to.have.length(1);
  //   expect(wrapper.find('#signup-form')).to.have.length(1);
  //   // console.log(wrapper.find('#signup-form'));
  //   // console.log(    wrapper.find('[type="submit"]').get(0)) ;
  //   // wrapper.find("#signup-form").simulate('submit');
  //   console.log(wrapper.find('button').get(0));
  //   wrapper.find('button').simulate('click');
  //   // console.log(callback)
  //   expect(callback.calledOnce).to.equal(true);
  //   // wrapper.find('#submit').simulate('click');
  //   // console.log(onButtonClick);
  //   // expect(onButtonClick).to.have.property('callCount', 1);  

  // });
});
