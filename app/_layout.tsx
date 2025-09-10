import { LanguageProvider } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';



export default function RootLayout () {
    /* const [loaded] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
      });
 */
    const colorScheme = useColorScheme();
    
    return (
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LanguageProvider>
                <Stack>
                    <Stack.Screen name="(protected)" options={{headerShown:false, animation:'none'}}/>
                    <Stack.Screen name="login" options={{headerShown:false, animation:'none'}}/>
                </Stack>
            </LanguageProvider>
            <StatusBar style="auto" />
            </ThemeProvider>
)
}