import dark from './dark.colorschema.json';
import light from './light.colorschema.json';
const isDarkMode: boolean = false;
const colorList = isDarkMode ? dark : light;
export const colorConfig = {
  white: colorList['col-white'],
  black: colorList['col-black'],
  container: colorList['col-container'],
  primary: colorList['col-primary'],
  secondary: colorList['col-secondary'],
  primaryText: colorList['col-primary-text'],
  secondaryText: colorList['col-secondary-text'],
  primaryDisable: colorList['col-primary-disable'],
};
