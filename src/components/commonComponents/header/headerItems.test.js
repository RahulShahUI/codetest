import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Header } from '../header/header'
import { MemoryRouter } from 'react-router-dom'

configure({ adapter: new Adapter() })

describe('<HeaderItems/>', () => {
    // let wrapper;
    // beforeEach(() => {
    //     wrapper = shallow(<Header />)
    // })
    it('includes link to home', () => {
        
        let wrapper = shallow( <MemoryRouter><Header/></MemoryRouter>)
        expect(wrapper.find('Link').prop('to')).to.be.equal('/home');
        //expect(wrapper.find(ListItem)).toHaveLength(4)
    })
    // it('should render three <ListItem> if  Authenticated', () => {
    //     wrapper.setProps({ isAuthenticated: true })
    //     expect(wrapper.find(ListItem)).toHaveLength(4)
    // })
    // it('should render the path when Product Library component is Loaded', () => {
    //     expect(wrapper.contains(<ListItem>
    //         <Link to="/productlibrary">
    //             Products Library
    //               </Link>
    //     </ListItem>)).toEqual(true)
    // })
    // it('should render the path when Product Library component is Loaded', () => {
    //     expect(wrapper.contains( <ListItem>
    //             <Link to="">
    //                 Login
    //         </Link>
    //         </ListItem>
    //     )).toEqual(true)
    // })


});
