import Storage from './storage'

export const Logged = () => {
    return Storage.get('accessToken') !== null ?? false
}
