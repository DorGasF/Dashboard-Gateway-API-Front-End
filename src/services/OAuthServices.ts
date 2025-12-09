import { signInWithFirebaseGoogle } from './firebase/FirebaseGoogleAuth'

export async function apiGoogleOauthSignIn() {
    return await signInWithFirebaseGoogle()
}
