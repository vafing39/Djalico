import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

type authState = {
    isLoggedIn : boolean,
    isAdmin : boolean,
    logIn : () => void,
    logOut : () => void,
    logInAsAdmin : ()=> void,
    logOutAsAdmin : () => void,
    ready:boolean
};

const authStorageKey = "my-key"

export const AuthContext = createContext<authState>({
    isLoggedIn : false,
    logIn : () => {},
    logOut : () => {},
    isAdmin : true,
    logInAsAdmin : ()=> {},
    logOutAsAdmin : ()=> {},
    ready : false 
})

export function AuthProvider({children}: PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true);
    const [ready, setIsready] = useState(false)
    
    const storeAuthState = async (newState : {isLoggedIn: boolean}) => {
        try{
            const jsonValue = JSON.stringify(newState);
            await AsyncStorage.setItem(authStorageKey, jsonValue)
        }
        catch (error){
            console.log("Error saving", error)
        }
    }

    const logIn = () => {
        setIsLoggedIn(true);
        storeAuthState({isLoggedIn: true})
        router.replace("/(protected)/(tabs)")
    };

    const logOut = () => {
        setIsLoggedIn(false);
        storeAuthState({isLoggedIn: false})
        router.replace('/login')
    };

    const logInAsAdmin = () => {
        setIsLoggedIn(true);
        storeAuthState({isLoggedIn: true})
        router.replace("/(protected)/(admin)/home")
    };

    const logOutAsAdmin = () => {
        setIsLoggedIn(false);
        router.replace("/login")
    };

    useEffect(()=>{
        const getAuthFromStorage = async () => {
            try{
                const value = await AsyncStorage.getItem(authStorageKey);
                if(value !==null){
                    const auth = JSON.parse(value);
                    setIsLoggedIn(auth.isLoggedIn);
                }
            }catch (error){
                console.log("Error fetching from storage", error)
            }
            setIsready(true);
        };
        getAuthFromStorage();
    }, [])

    return(
        <AuthContext.Provider value={{ready, isLoggedIn, logIn, logOut, isAdmin, logInAsAdmin, logOutAsAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}