import { getAuth, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './init';


const fbAuthProvider = new FacebookAuthProvider();
const auth = getAuth(app);


export const facebookAuth = async () => {
    const fbAuth = signInWithPopup(auth, fbAuthProvider);
    return fbAuth;
}