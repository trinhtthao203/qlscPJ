import {useState} from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
} from 'native-base';
import {images, theme} from '../assets';
import {Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {
  setTaiKhoan,
  setMatKhau,
  setToken,
  setError,
  setShow,
} from '../Contains/Login';

export default LogIn = ({navigation}) => {
  const dispatch = useDispatch();
  const {taikhoan, matkhau, token, error, show} = useSelector(
    state => state.login,
  );

  const _handleSave = async val => {
    try {
      dispatch(setToken(val));
      await AsyncStorage.setItem('token', val);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogIn = async () => {
    dispatch(setError(null));
    try {
      let res = await axios.post('/auth/login', {
        username: taikhoan,
        password: matkhau,
      });
      if (res.data.code === 400) setError(res.data.errors.message);
      else {
        _handleSave(res.data.data.access_token);
        navigation.replace('TabBar');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
              <VStack space={3} mt="5">
                <Image
                  source={images.logo}
                  resizeMode="contain"
                  style={{width: '100%', height: '25%', marginBottom: 50}}
                />
                <FormControl>
                  <Text style={{marginVertical: 10}} bold>
                    Tên tài khoản
                  </Text>
                  <Input
                    placeholder="Nhập tên tài khoản"
                    value={taikhoan}
                    onChangeText={val => dispatch(setTaiKhoan(val))}
                  />
                </FormControl>
                <FormControl>
                  <Text style={{marginVertical: 10}} bold>
                    Mật khẩu
                  </Text>
                  <Input
                    placeholder="Nhập mật khẩu"
                    value={matkhau}
                    onChangeText={val => dispatch(setMatKhau(val))}
                    w={{
                      base: '100%',
                      md: '25%',
                    }}
                    type={show ? 'text' : 'password'}
                    InputRightElement={
                      <Icon
                        name={show ? 'eye' : 'eye-slash'}
                        onPress={() => dispatch(setShow(!show))}
                        size={20}
                        color="#0A8E9D"
                        style={{marginRight: 10}}
                      />
                    }
                  />
                </FormControl>
                <Text style={{color: theme.COLORS.error700}}>{error}</Text>
                <Button mt="7" color={'#0A8E9D'} onPress={handleLogIn}>
                  Đăng nhập
                </Button>
                <HStack mt="6" justifyContent="center"></HStack>
              </VStack>
            </Box>
          </Center>
        </Center>
      </NativeBaseProvider>
    </>
  );
};
