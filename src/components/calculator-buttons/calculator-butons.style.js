import { StyleSheet, Dimensions } from 'react-native';

const btnDimension = Dimensions.get('window').width > 360 ? 80 : 70;
const spaceAround = Dimensions.get('window').width > 360 ? 8 : 7;

export const styles = StyleSheet.create({
  btn: {
    width: btnDimension,
    height: btnDimension,
    borderRadius: 50,
    margin: spaceAround,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    height: 28,
    textAlignVertical: 'center',
    textAlign: 'center',
    color:'#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
