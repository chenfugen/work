import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, message, Space } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import ParamsEdit from './ParamsEdit'
import { DataTypeEnum } from '../../../config/Enum'
import { DataTypeNameEnum } from '../../../config/Enum'
import DataDefinition from '../../../components/DataDefinition'
import FormForSearch from '../../../components/FormForSearch'
import ExceptionDisplay from '../../../components/ExceptionDisplay'
import { useHistory } from 'react-router-dom'
import style from './css/ParamsTable.module.css'

const jsonArr = [
  {
    type: 'input',
    filed: 'param',
    placeholder: '属性标识符'
  },
  {
    type: 'input',
    filed: 'name',
    placeholder: '属性名称'
  }
]

const ParamsTable = (props: any) => {
  const [data, setData] = useState([])
  const [total, seTtotal] = useState(0)
  const [dataTypes, setDataTypes] = useState([])
  const [searchParams, setsearchParams] = useState({})
  const [propertyDetail, setPropertyDetail] = useState('')
  const [visible, setVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  let history = useHistory()
  const queryParams = () => {
    let params = {
      modelId: props.id,
      ...searchParams
    }
    setTableLoading(true)
    request
      .get(api.system.model_detail_params, params)
      .then((res) => {
        setData(res.data)
        seTtotal(res.data.length)
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  const queryDataType = () => {
    return request.get(api.common.select_dataType).then((res) => {
      setDataTypes(res.data)
    })
  }
  const queryPropertyDetail = (id: string) => {
    let params = {
      id: id
    }
    return request.get(api.system.model_detail_params_update, params).then((res) => {
      if (res.data.type === DataTypeEnum.ENUM) {
        try {
          const obj = JSON.parse(res.data.enumJson)
          const arr = []
          for (const key in obj) {
            const tem = {
              name: key,
              value: obj[key]
            }
            arr.push(tem)
          }
          res.data.enumJson = arr
        } catch (e) {
          res.data.enumJson = []
        }
      } else if (res.data.type === DataTypeEnum.BOOLEAN) {
        try {
          res.data.enumJson = JSON.parse(res.data.enumJson)
        } catch (e) {
          res.data.enumJson = {}
        }
      }
      setPropertyDetail(res.data)
    })
  }
  useEffect(queryParams, [props.id, searchParams])
  const handleClick = () => {
    queryDataType().then(() => {
      setPropertyDetail('')
      setVisible(true)
    })
  }
  const handleToJSON = () => {
    history.push(`/system/model/detail/json/${props.id}`)
  }
  const handleDelete = (e: any, row: any) => {
    Modal.confirm({
      content: `确认删除${row.name}?`,
      centered: true,
      onOk() {
        let params = {
          id: row.id
        }
        return request.post(api.system.model_detail_params_delete, params).then(() => {
          queryParams()
          props.queryDetail()
          message.success('删除成功')
        })
      }
    })
  }
  const handleEdit = (e: any, row: any) => {
    Promise.all([queryDataType(), queryPropertyDetail(row.id)]).then(() => {
      setVisible(true)
    })
  }
  const search = (params: any) => {
    setsearchParams(params)
  }
  const columns = [
    {
      title: '属性标识符',
      dataIndex: 'param'
    },
    {
      title: '属性名称',
      dataIndex: 'name'
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      render(type: DataTypeEnum) {
        return DataTypeNameEnum[type]
      }
    },
    {
      title: '数据定义',
      dataIndex: 'type',
      render(val: string, row: any) {
        return DataDefinition(row)
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      render(_: any, row: any) {
        if (props.role.editRole) {
          return (
            <>
              <Button type='text' onClick={(e) => handleEdit(e, row)} size='small'>
                编辑
              </Button>
              <Button type='text' onClick={(e) => handleDelete(e, row)} size='small'>
                删除
              </Button>
            </>
          )
        }
        return null
      }
    }
  ]
  return (
    <>
      <FormForSearch jsonArr={jsonArr} search={search} />
      <Space style={{ marginBottom: '16px' }}>
        {props.role.editRole ? (
          <Button type='primary' onClick={handleClick}>
            新增属性
          </Button>
        ) : null}
        <Button onClick={handleToJSON}>查看JSON格式</Button>
      </Space>
      <Table
        pagination={false}
        rowKey='id'
        dataSource={data}
        columns={columns}
        size='middle'
        loading={tableLoading}
      />
      <div className={style.total}>共 {total} 条</div>
      {visible && (
        <ParamsEdit
          visible={visible}
          setVisible={setVisible}
          row={{ modelId: props.id }}
          detail={propertyDetail}
          dataTypes={dataTypes}
          queryParams={queryParams}
          queryDetail={() => props.queryDetail()}
        />
      )}
    </>
  )
}

export default ParamsTable
