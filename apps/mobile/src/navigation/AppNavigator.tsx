import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { PlayersScreen } from '../screens/PlayersScreen';
import { NewGameScreen } from '../screens/NewGameScreen';
import { GameScreen } from '../screens/GameScreen';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Players: undefined;
  NewGame: undefined;
  Game: { gameId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle: { backgroundColor: colors.brandCard },
          headerTintColor: colors.brandText,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.brandBg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: '⚔️ Munchkin', headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '⚔️ Munchkin' }}
        />
        <Stack.Screen
          name="Players"
          component={PlayersScreen}
          options={{ title: 'Jogadores' }}
        />
        <Stack.Screen
          name="NewGame"
          component={NewGameScreen}
          options={{ title: 'Nova Partida' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Partida', headerBackTitle: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
