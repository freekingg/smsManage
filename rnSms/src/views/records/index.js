import React, { useState } from "react";
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
  ScrollView,
  Hidden,
  Center,
  StatusBar,
  Box,
  Stack,
  Heading,
} from "native-base";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign, Entypo } from "@expo/vector-icons";

export default function SignUp(props) {
  const smsList = useSelector((state) => state.app.sms_info) || [];

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
          bg: "primary.900",
        }}
        _dark={{
          bg: "coolGray.900",
        }}
      />
      <Center
        my="auto"
        _dark={{
          bg: "coolGray.900",
        }}
        _light={{
          bg: "primary.900",
        }}
        flex="1"
      >
        <Stack
          flexDirection={{
            base: "column",
            md: "row",
          }}
          w="100%"
          flex={{
            base: "1",
          }}
        >
          <VStack flex={1} mt="4" mb="5" space="9">
            <HStack space="2" px="4" alignItems="center">
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
                Records
              </Text>
            </HStack>

            <ScrollView flex={1} bg="#fff">
              {smsList.map((item,index) => (
                <Box key={index} padding={3}>
                  <Text>{item.phone || item.title}</Text>
                  <Text>{item.message}</Text>
                  <Text>{item.time} - {item.status || 'fail'}</Text>
                  <Divider mt={2}></Divider>
                </Box>
              ))}
            </ScrollView>
          </VStack>
        </Stack>
      </Center>
    </>
  );
}
