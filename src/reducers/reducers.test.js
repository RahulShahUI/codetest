import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as actionTypes from '../actions/actions';
import reducer from './reducer';



configure({ adapter: new Adapter() })

describe('auth reducer', () => {

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            categories: [],
            Products: [],
            isAuthenticated: "",
            loginResponse: "",
            configbundel: [],
            Submit: {},
            totalProduct: 0
        })
    })


    
    it('should store the token upon login', () => {
        expect(reducer({
            categories: [],
            Products: [],
            isAuthenticated: "",
            loginResponse: "",
            configbundel: [],
            Submit: {},
            totalProduct: 0
        }, {
            type: actionTypes.OKTA_LOGIN,
            isAuthenticated:'some-token'
        })).toEqual({
            categories: [],
            Products: [],
            isAuthenticated: 'some-token',
            loginResponse: "",
            configbundel: [],
            Submit: {},
            totalProduct: 0
        })
    })
});
