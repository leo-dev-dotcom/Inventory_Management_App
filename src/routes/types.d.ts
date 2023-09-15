import {Action} from '@react-navigation/routers/lib/typescript/src/CommonActions';
export interface NavigationProps {
  navigate: (routeName: RouteNames, params?: Object) => {};
  replace: (routeName: RouteNames, params?: Object) => {};
  goBack: () => {};
  canGoBack: () => {};
  dispatch: (data: Action) => {};
  emit: (data: {type: 'tabLongPress' | 'tabPress'; target: string}) => any;
}
export interface RouteProps {
  name: RouteNames;
  params: any;
}
export type RouteNames = 'Splash' | 'Login' | 'Inventory';
