import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import LoginScreen from '../screens/LoginScreen';
import SignOut from '../screens/SignOut';
import VerifySignUpScreen from '../screens/VerifySignUpScreen';
import {navigationRef} from '../utils/NavigationUtil';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
            drawerItemStyle: {height: 0},
            animation: 'reveal_from_bottom',
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            drawerItemStyle: {height: 0},
            animation: 'reveal_from_bottom',
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            drawerItemStyle: {height: 0},
            animation: 'reveal_from_bottom',
          }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{
            headerShown: false,
            drawerItemStyle: {height: 0},
            animation: 'reveal_from_bottom',
          }}
        />
        <Stack.Screen
          name="SignOut"
          component={SignOut}
          options={{
            headerShown: false,
            drawerItemStyle: {height: 0},
            animation: 'reveal_from_bottom',
          }}
        />
        <Stack.Screen
          name="VerifySignUpScreen"
          component={VerifySignUpScreen}
          options={{
            headerShown: false,
            drawerItemStyle: {height: 0},
            animation: 'reveal_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
