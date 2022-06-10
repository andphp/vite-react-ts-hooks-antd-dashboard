import { atom } from 'recoil'
import  { initialState } from '@/stores/user'

export const userState = atom({
    key: 'userState',
    default: initialState
})
