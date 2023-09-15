import {StyleSheet} from 'react-native';
import {colorConfig} from '../../../../assets/colors/setup.color';

export const style = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colorConfig.container,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image_box: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 100,
  },

  input: {
    width: 320,
    margin: 12,
  },

  loginBtn: {
    width: '50%',
    marginTop: 100,
  },

  loginHeader: {
    fontSize: 30,
    fontWeight: '700',
  },
});
