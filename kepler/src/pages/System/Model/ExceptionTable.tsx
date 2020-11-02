import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, message } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import ExceptionEdit from './ExceptionEdit'
import { DataTypeEnum } from '../../../config/Enum'
import { DataTypeNameEnum } from '../../../config/Enum'
import DataDefinition from '../../../components/DataDefinition'
import ExceptionDisplay from '../../../components/ExceptionDisplay'
import style from './css/ParamsTable.module.css'

const ExceptionTable = (props: any) => {
  const [data, setData] = useState([])
  const [total, seTtotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [property, setProperty] = useState<any>([])
  const [exceptionDetail, setExceptionDetail] = useState('')
  const queryPropertyType = (api: string) => {
    let params = {
      modelId: props.id
    }
    return request.get(api, params).then((res) => {
      setProperty(res.data)
    })
  }
  const queryExceptionDetail = (propertyId: string) => {
    let params = {
      propertyId: propertyId
    }
    return request.get(api.system.model_detail_exception_update, params).then((res) => {
      setExceptionDetail(res.data)
    })
  }
  const queryException = () => {
    if (props.active) {
      let params = {
        modelId: props.id
      }
      setTableLoading(true)
      request
        .get(api.system.model_detail_exception, params)
        .then((res) => {
          setData(res.data)
          seTtotal(res.data.length)
        })
        .finally(() => {
          setTableLoading(false)
        })
    }
  }
  useEffect(queryException, [props.id, props.active])
  const handleClick = () => {
    queryPropertyType(api.common.select_property_exception_repeat).then(() => {
      setExceptionDetail('')
      setVisible(true)
    })
  }
  const handleEdit = (e: any, row: any) => {
    Promise.all([
      queryPropertyType(api.common.select_property),
      queryExceptionDetail(row.propertyId)
    ]).then(() => {
      setType(row.type)
      setVisible(true)
    })
  }
  const handleDelete = (e: any, row: any) => {
    Modal.confirm({
      content: `确认删除${row.name}?`,
      centered: true,
      onOk(close) {
        let params = {
          propertyId: row.propertyId
        }
        return request
          .post(api.system.model_detail_exception_delete, params)
          .then(() => {
            queryException()
            props.queryDetail()
            message.success('删除成功')
          })
          .finally(() => {
            close()
          })
      }
    })
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
      title: '异常值',
      dataIndex: 'type',
      render(type: string, row: any) {
        return ExceptionDisplay(row)
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
      {props.role.editRole ? (
        <Button type='primary' onClick={handleClick} style={{ marginBottom: '16px' }}>
          新增异常
        </Button>
      ) : null}
      <Table
        loading={tableLoading}
        rowKey='propertyId'
        dataSource={data}
        columns={columns}
        size='middle'
        pagination={false}
      />
      <div className={style.total}>共 {total} 条</div>
      {visible && (
        <ExceptionEdit
          visible={visible}
          detail={exceptionDetail}
          setVisible={setVisible}
          row={{ modelId: props.id }}
          type={type}
          queryException={queryException}
          queryDetail={() => props.queryDetail()}
          property={property}
        />
      )}
    </>
  )
}

export default ExceptionTable
