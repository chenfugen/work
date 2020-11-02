import Mock from 'mockjs'
import api from '../api'
import { createObjectData, addPre } from './utils.js'

Mock.setup({
  timeout: '1500-2500'
})

Mock.mock(
  addPre(api.system.model_series_list),
  'get',
  createObjectData([
    {
      name: '系列1',
      code: '1',
      id: '1'
    },
    {
      name: '系列2',
      code: '2',
      id: '2'
    },
    {
      name: '系列3',
      code: '3',
      id: '3'
    }
  ])
)
Mock.mock(
  addPre(api.system.menu_list),
  'get',
  createObjectData([
    {
      name: '系列1',
      url: '1',
      id: '1',
      status: Math.random() > 0.5 ? 'Y' : 'N',
      children: [
        {
          name: '型号1',
          url: '11',
          id: '111',
          status: Math.random() > 0.5 ? 'Y' : 'N'
        }
      ]
    },
    {
      name: '系列2',
      url: '2',
      id: '2',
      status: Math.random() > 0.5 ? 'Y' : 'N'
    },
    {
      name: '系列3',
      url: '3',
      id: '3',
      status: Math.random() > 0.5 ? 'Y' : 'N'
    }
  ])
)
Mock.mock(
  addPre(api.system.role_list),
  'get',
  createObjectData([
    {
      name: '系列1',
      status: Math.random() > 0.5 ? 'Y' : 'N',
      description: '描述'
    },
    {
      name: '系列2',
      status: Math.random() > 0.5 ? 'Y' : 'N',
      description: '描述'
    },
    {
      name: '系列3',
      status: Math.random() > 0.5 ? 'Y' : 'N',
      description: '描述'
    }
  ])
)
Mock.mock(
  addPre(api.system.log_list),
  'get',
  createObjectData({
    list: [
      {
        accountName: '系列1',
        ipAddr: '1.1.1.2',
        uri: '/api/a',
        eventTime: '1923',
        model: '18'
      },
      {
        accountName: '系列2',
        ipAddr: '1.1.1.1',
        uri: '/api/b',
        eventTime: '1283',
        model: '19'
      },
      {
        accountName: '系列3',
        ipAddr: '1.1.1.3',
        uri: '/api/c',
        eventTime: '1723',
        model: '10'
      }
    ],
    total: 100
  })
)
Mock.mock(
  addPre(api.system.model_model_list),
  'get',
  createObjectData([
    {
      name: '型号1',
      id: '123',
      status: 'ing',
      code: '/api/a',
      createTime: '1923',
      deviceCount: '18'
    },
    {
      name: '型号2',
      id: '124',
      status: 'ing',
      code: '/api/b',
      createTime: '1283',
      deviceCount: '19'
    },
    {
      name: '型号3',
      id: '125',
      status: 'ing',
      code: '/api/c',
      createTime: '1723',
      deviceCount: '10'
    }
  ])
)
Mock.mock(
  addPre(api.system.model_detail_params),
  'get',
  createObjectData([
    {
      name: '型号1',
      id: '123',
      status: 'ing',
      code: '/api/a',
      createTime: '1923',
      deviceCount: '18'
    },
    {
      name: '型号2',
      id: '124',
      status: 'ing',
      code: '/api/b',
      createTime: '1283',
      deviceCount: '19'
    },
    {
      name: '型号3',
      id: '125',
      status: 'ing',
      code: '/api/c',
      createTime: '1723',
      deviceCount: '10'
    }
  ])
)
Mock.mock(
  addPre(api.system.model_model_detail),
  'get',
  createObjectData({
    name: '1111',
    id: '123',
    code: '123',
    seriesName: '123',
    createTime: '123',
    lasetUpdateTime: '123',
    method: '123',
    deviceCount: '123'
  })
)
Mock.mock(addPre(api.system.menu_delete), 'post', createObjectData(null))
Mock.mock(addPre(api.system.menu_state), 'post', createObjectData(null))
Mock.mock(addPre(api.system.menu_add), 'post', createObjectData(null))
Mock.mock(addPre(api.system.role_delete), 'post', createObjectData(null))
Mock.mock(addPre(api.system.role_state), 'post', createObjectData(null))
Mock.mock(addPre(api.system.role_add), 'post', createObjectData(null))
