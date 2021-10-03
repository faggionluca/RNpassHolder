import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../"
import { Icon, IndexPath, MenuItem, OverflowMenu, TopNavigationAction } from "@ui-kitten/components"
import { useState } from "react"
import { translate } from "../../i18n"

const BurgerIcon = (props) => (
  <Icon {...props} name="more-vertical" />
)

export interface ViewPassActionMenuProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  onSave?: () => void,
  onDelete?: () => void,
  onSetExpiration?: () => void,
  onSetFavorite?: () => void
}

/**
 * Describe your component here
 */
export const ViewPassActionMenu = observer(function ViewPassActionMenu(props: ViewPassActionMenuProps) {

  const [visible, setVisible] = useState(false);

  const onItemSelect = (index: IndexPath) => {
    console.log("ViewPassActionMenu: Index:", index)
    console.log("ViewPassActionMenu: Props:", props)
    setVisible(false);
    switch (index.row) {
      case 0:
        props?.onSave?.()
        break;
      case 1:
        props?.onSetExpiration?.()
        break;
      case 2:
        props?.onSetFavorite?.()
        break;
      case 3:
        props?.onDelete?.()
        break;
    }
  };

  const renderNavAction = () => (
    <TopNavigationAction
      {...props}
      icon={BurgerIcon}
      onPress={() => setVisible(true)}
    />
  )

  return (
    <OverflowMenu
      anchor={renderNavAction}
      visible={visible}
      onSelect={onItemSelect}
      onBackdropPress={() => setVisible(false)}>
      <MenuItem title={translate('viewPass.saveToGallery')} />
      <MenuItem title={translate('viewPass.setExpire')} />
      <MenuItem title={translate('viewPass.setFavorite')} />
      <MenuItem title={translate('viewPass.delete')} />
    </OverflowMenu>
  )
})