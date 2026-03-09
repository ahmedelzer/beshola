import { View, Text } from 'react-native'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { theme } from '../../Theme'
import MapDrawer from './MapDrawer'
import { useSelector } from 'react-redux'
import { useWS } from '../../../context/WSProvider'
import { useShopNode } from '../../../context/ShopNodeProvider'
import reducer from '../Pagination/reducer'
import { initialState, OFF_SET_SCROLL, VIRTUAL_PAGE_SIZE } from '../Pagination/initialState'
import AssetsSchemaActions from '../../Schemas/MenuSchema/AssetsSchemaActions.json'
import AssetsSchema from '../../Schemas/MenuSchema/AssetsSchema.json'
import { useNetwork } from '../../../context/NetworkContext'
import { createRowCache } from '../Pagination/createRowCache'
import { buildApiUrl } from '../../../components/hooks/APIsFunctions/BuildApiUrl'
import { prepareLoad } from '../../utils/operation/loadHelpers'
import { ConnectToWS } from '../../utils/WS/ConnectToWS'
import { WSMessageHandler } from '../../utils/WS/handleWSMessage'
import { getRemoteRows } from '../Pagination/getRemoteRows'
import Sheet from '../../utils/component/Sheet'
import { addAlpha } from '../../utils/operation/addAlpha'

const DrawerComponent = ({polygonObj,setOpenDrawer}) => {
  return (
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      zIndex: 10,
      pointerEvents: "auto",
    }}
  >
      <MapDrawer row={polygonObj} onClose={() => setOpenDrawer(false)} />
    </View>
  )
}

export default DrawerComponent