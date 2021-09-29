import * as React from "react"
import { StyleProp, View, ViewProps, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { StyleService, useStyleSheet, Text, Layout, TextProps } from "@ui-kitten/components"

export interface KitSelectSourceProps extends ViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  title?: string
  titleProps?: TextProps
}

/**
 * Describe your component here
 */
export const KitSelectSource = observer(function KitSelectSource(props: KitSelectSourceProps) {
  const { style } = props
  const styles = useStyleSheet(styleComp)

  return (
    <View style={styles.ROOT}>
      <Layout style={styles.LAYOUT}>
        <Text
          category="h4"
          {...props.titleProps}
          style={[styles.TEXT, props.titleProps?.style]}
        >
          {props.title}
        </Text>
        <View style={styles.PLACEHOLDER} />
      </Layout>
    </View>
  )
})

const styleComp = StyleService.create({
  ROOT: {
    backgroundColor: 'background-basic-color-1',
    borderRadius: 20,
    elevation: 20,
    padding: 8,
    margin: 16,
    flex: 1,
    width: '100%'
  },
  TEXT: {
    marginBottom: 'auto'
  },
  LAYOUT: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  PLACEHOLDER: {
    backgroundColor: 'color-primary-200',
    borderRadius: 20,
    width: 128,
    height: 128,
    marginBottom: 'auto'
  }
})