import React, {useState} from 'react';
import {
  Button,
  Checkbox,
  Image,
  HStack,
  VStack,
  Text,
  Link,
  Divider,
  Icon,
  IconButton,
  useColorModeValue,
  Pressable,
  Hidden,
  Center,
  StatusBar,
  Box,
  Stack,
} from 'native-base';

import { AntDesign,Entypo } from '@expo/vector-icons';

import IconGoogle from './components/IconGoogle';
import IconFacebook from './components/IconFacebook';
import FloatingLabelInput from './components/FloatingLabelInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function SignUpForm({props}) {
  // add next router here
  const [text, setText] = useState('');
  const [pass, setPass] = useState('');
  const [confirm_pass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{
        flex: 1,
      }}>
      <VStack
        flex="1"
        px="6"
        py="9"
        _light={{
          bg: 'white',
        }}
        _dark={{
          bg: 'coolGray.800',
        }}
        justifyContent="space-between"
        space="3"
        borderTopRightRadius={{
          base: '2xl',
          md: 'xl',
        }}
        borderBottomRightRadius={{
          base: '0',
          md: 'xl',
        }}
        borderTopLeftRadius={{
          base: '2xl',
          md: '0',
        }}>
        <VStack space="7">
          <VStack>
            <VStack space="8">
              <VStack
                space={{
                  base: '7',
                  md: '4',
                }}>
                <FloatingLabelInput
                  isRequired
                  label="上报接口"
                  labelColor="#9ca3af"
                  labelBGColor={useColorModeValue('#fff', '#1f2937')}
                  borderRadius="4"
                  defaultValue={text}
                  onChangeText={txt => setText(txt)}
                  _text={{
                    fontSize: 'sm',
                    fontWeight: 'medium',
                  }}
                  _dark={{
                    borderColor: 'coolGray.700',
                  }}
                  _light={{
                    borderColor: 'coolGray.300',
                  }}
                />
                <FloatingLabelInput
                  isRequired
                  type={showPass ? '' : 'password'}
                  label="Password"
                  borderRadius="4"
                  labelColor="#9ca3af"
                  labelBGColor={useColorModeValue('#fff', '#1f2937')}
                  defaultValue={pass}
                  onChangeText={txt => setPass(txt)}
                  InputRightElement={
                    <IconButton
                      variant="unstyled"
                      icon={
                        <Icon
                          size="4"
                          color="coolGray.400"
                          as={Entypo}
                          name={showPass ? 'eye-with-line' : 'eye'}
                        />
                      }
                      onPress={() => {
                        setShowPass(!showPass);
                      }}
                    />
                  }
                  _text={{
                    fontSize: 'sm',
                    fontWeight: 'medium',
                  }}
                  _dark={{
                    borderColor: 'coolGray.700',
                  }}
                  _light={{
                    borderColor: 'coolGray.300',
                  }}
                />

                <FloatingLabelInput
                  isRequired
                  type={showConfirmPass ? '' : 'password'}
                  label="Confirm Password"
                  borderRadius="4"
                  labelColor="#9ca3af"
                  labelBGColor={useColorModeValue('#fff', '#1f2937')}
                  defaultValue={confirm_pass}
                  onChangeText={txt => setConfirmPass(txt)}
                  InputRightElement={
                    <IconButton
                      variant="unstyled"
                      icon={
                        <Icon
                          size="4"
                          color="coolGray.400"
                          as={Entypo}
                          name={showConfirmPass ? 'eye-with-line' : 'eye'}
                        />
                      }
                      onPress={() => {
                        setShowConfirmPass(!showConfirmPass);
                      }}
                    />
                  }
                  _text={{
                    fontSize: 'sm',
                    fontWeight: 'medium',
                  }}
                  _dark={{
                    borderColor: 'coolGray.700',
                  }}
                  _light={{
                    borderColor: 'coolGray.300',
                  }}
                />
              </VStack>
              {/* Opening Link Tag navigateTo:"OTP" (react/Router) */}
              <Button
                size="md"
                borderRadius="4"
                _text={{
                  fontSize: 'sm',
                  fontWeight: 'medium',
                }}
                _light={{
                  bg: 'primary.900',
                }}
                _dark={{
                  bg: 'primary.700',
                }}
                onPress={() => {
                  props.navigation.navigate('signIn');
                }}>
                Submit
              </Button>
              {/* Closing Link Tag */}
              <HStack
                space="2"
                mb={{
                  base: '6',
                  md: '7',
                }}
                alignItems="center"
                justifyContent="center">
                <Divider
                  w="30%"
                  _light={{
                    bg: 'coolGray.200',
                  }}
                  _dark={{
                    bg: 'coolGray.700',
                  }}></Divider>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  _light={{
                    color: 'coolGray.300',
                  }}
                  _dark={{
                    color: 'coolGray.500',
                  }}>
                  or
                </Text>
                <Divider
                  w="30%"
                  _light={{
                    bg: 'coolGray.200',
                  }}
                  _dark={{
                    bg: 'coolGray.700',
                  }}></Divider>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default function SignUp(props) {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{
          bg: 'primary.900',
        }}
        _dark={{
          bg: 'coolGray.900',
        }}
      />
      <Center
        my="auto"
        _dark={{
          bg: 'coolGray.900',
        }}
        _light={{
          bg: 'primary.900',
        }}
        flex="1">
        <Stack
          flexDirection={{
            base: 'column',
            md: 'row',
          }}
          w="100%"
          maxW={{
            md: '1016px',
          }}
          flex={{
            base: '1',
            md: 'none',
          }}>
          <Hidden from="md">
            <VStack px="4" mt="4" mb="5" space="9">
              <HStack space="2" alignItems="center">
                <IconButton
                  pl="0"
                  variant="unstyled"
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                  icon={
                    <Icon
                      size="6"
                      as={AntDesign}
                      name="arrowleft"
                      color="coolGray.50"
                    />
                  }
                />
                <Text color="coolGray.50" fontSize="lg">
                  Setting
                </Text>
              </HStack>
              
            </VStack>
          </Hidden>
          <SignUpForm props={props} />
        </Stack>
      </Center>
    </>
  );
}
