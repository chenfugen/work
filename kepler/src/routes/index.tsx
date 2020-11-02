import BasicLayout from '../layouts/BasicLayout'
import UserLayout from '../layouts/UserLayout'

import Device from '../pages/Device/CheckPage'
import DeviceDetail from '../pages/Device/DeviceDetail'
import DeviceExceptionDetail from '../pages/Device/ExceptionDetail'
import Model from '../pages/System/Model'
import ModelDetail from '../pages/System/Model/ModelDetail'
import ModelDetailJson from '../pages/System/Model/ModelDetailJson'
import Account from '../pages/System/Account'
import Menu from '../pages/System/Menu'
import Role from '../pages/System/Role'
import Log from '../pages/System/Log'

import Single from '../pages/Analysis/Single'
import Multiple from '../pages/Analysis/Multiple'
import Contrast from '../pages/Analysis/Contrast'
import Exception from '../pages/Analysis/Exception/CheckPage'
import ExceptionDetail from '../pages/Analysis/Exception/ExceptionDetail'
//缺陷跟踪
import Defect from '../pages/Defects/CheckPage'
import DefectChart from '../pages/Defects/chart'
import DefectDetail from '../pages/Defects/detail'
import DefectEdit from '../pages/Defects/edit'
const routes = [
  {
    path: '/',
    exact: true,
    component: UserLayout
  },
  {
    path: '/',
    // exact: true,
    component: BasicLayout,
    routes: [
      {
        path: '/device',
        exact: true,
        component: Device
      },
      {
        path: '/device/detail/:code',
        exact: true,
        component: DeviceDetail
      },
      {
        path: '/device/detail/:code/exception/:id',
        exact: true,
        component: DeviceExceptionDetail
      },
      {
        path: '/analysis/single',
        exact: true,
        component: Single
      },
      {
        path: '/analysis/multiple',
        exact: true,
        component: Multiple
      },
      {
        path: '/analysis/contrast',
        exact: true,
        component: Contrast
      },
      {
        path: '/analysis/exception',
        exact: true,
        component: Exception
      },
      {
        path: '/analysis/exception/detail',
        exact: true,
        component: ExceptionDetail
      },
      {
        path: '/defects',
        exact: true,
        component: Defect
      },
      {
        path: '/defects/chart',
        exact: true,
        component: DefectChart
      },
      {
        path: '/defects/detail/:id/:modelCode',
        exact: true,
        component: DefectDetail
      },
      {
        path: '/defects/edit/:id/:modelCode',
        exact: true,
        component: DefectEdit
      },
      {
        path: '/system/model',
        exact: true,
        component: Model
      },
      {
        path: '/system/model/detail/:id',
        exact: true,
        component: ModelDetail
      },
      {
        path: '/system/model/detail/json/:modelId',
        exact: true,
        component: ModelDetailJson
      },
      {
        path: '/system/menu',
        exact: true,
        component: Menu
      },
      {
        path: '/system/account',
        exact: true,
        component: Account
      },
      {
        path: '/system/role',
        exact: true,
        component: Role
      },
      {
        path: '/system/log',
        exact: true,
        component: Log
      }
    ]
  }
]

export default routes
