/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { BackHandler, Dimensions, ToastAndroid, View } from "react-native"
import { KitBackAction, KitDialog, KitDialogRef, KitHeader, Screen, ViewPassActionMenu, ViewPassPlaceholder, ViewPassQrDetails } from "../../components"
import { StyleService, useStyleSheet, Layout } from "@ui-kitten/components"
import { useStores } from "../../models"
import { getRealmDatabase, QRPass, removePass } from "../../services/database"
import { ObjectId } from 'bson'
import { useFocusEffect } from "@react-navigation/core"
import { NavigatorParamList } from "../../navigators"
import { StackScreenProps } from "@react-navigation/stack"
import { translate } from "../../i18n"
import QRCode from "react-native-qrcode-svg"
import { delay } from "../../utils/delay"
import { useTheme } from "@react-navigation/native"

export const ViewPassScreen: FC<StackScreenProps<NavigatorParamList, "viewPass">> = observer(function ViewPassScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const styles = useStyleSheet(styleScreen)
  const navTheme = useTheme()
  const { currentPassStore, statusBarStore, favoritePassStore } = useStores()
  const [pass, setPass] = useState<QRPass>()
  const deleteDialog = useRef<KitDialogRef>()

  const onBackPress = () => {
    console.log("ViewPassScreen: Navigating home")
    navigation.navigate('home')
    return true
  }

  useFocusEffect(() => {
    statusBarStore.setBgColor(navTheme.colors.background)
  })

  useEffect(() => {
    const getPass = async () => {
      const realm = await getRealmDatabase()
      const passData = realm.objectForPrimaryKey("Pass", new ObjectId(currentPassStore.id))
      // await delay(5000)
      setPass(passData as any)
      console.log("ViewPassScreen: PASS GET:", JSON.stringify(pass, null, 2))
    }
    getPass()
  }, [currentPassStore.id])

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  const qrSize = Dimensions.get('screen').width - 16

  const onDeleteAction = useCallback(() => {
    if (favoritePassStore.id === pass._id.toHexString()) {
      favoritePassStore.setFavorite('')
    }
    removePass(pass)
    currentPassStore.setPass('')
    navigation.navigate('home')
  }, [pass, favoritePassStore.id])

  const onFavoriteAction = useCallback(() => {
    if (pass) {
      favoritePassStore.setFavorite(pass._id.toHexString())
      console.log("ViewPassScreen: onFavoriteAction: id:", favoritePassStore.id)
      ToastAndroid.show(translate('viewPass.favoriteSetMessage'), ToastAndroid.SHORT)
    }
  }, [pass])

  return (
    <View style={styles.ROOT}>
      <KitDialog ref={deleteDialog} />
      <KitHeader
        title={translate("viewPass.title")}
        accessoryLeft={<KitBackAction onPress={() => navigation.navigate('home')} />}
        accessoryRight={
          <ViewPassActionMenu
            onDelete={() => deleteDialog.current.show({
              title: translate('common.warning'),
              status: 'danger',
              description: translate('viewPass.deleteDialogMessage'),
              okText: translate('common.yes'),
              cancelText: translate('common.no'),
              onOk: () => {
                deleteDialog.current.dismiss()
                onDeleteAction()
              },
              onCancel: () => deleteDialog.current.dismiss()
            })}
            onSetFavorite={onFavoriteAction}
        />}
        setStatusBar={false}
        style={[styles.NAV, {backgroundColor: navTheme.colors.background}]}
        alignment="center"
      />
      <Screen style={[styles.SCREEN, {backgroundColor: navTheme.colors.background}]} preset="fixed">
        {pass &&
          <Layout style={styles.LAYOUT}>
            <View style={styles.QR}><QRCode size={qrSize} value={pass.qr} /></View>
            <ViewPassQrDetails qr={pass} />
          </Layout>
        }
        <ViewPassPlaceholder show={!pass} />
      </Screen>
    </View>
  )
})


const styleScreen = StyleService.create({
  ROOT: {
    flex: 1,
  },
  SCREEN: {
    flex:1,
    display: 'flex',
    overflow: 'hidden',
  },
  NAV: {
    minHeight: 64,
  },
  LAYOUT: {
    flex: 1,
    backgroundColor: 'transparent',
    // marginHorizontal: 32,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 16,
    marginTop: 64,
  },
  QR: {
    marginTop: 16
  }
})
