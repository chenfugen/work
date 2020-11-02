import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Space, Radio, message } from 'antd'
import {
  FormOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleFilled
} from '@ant-design/icons'
import { ConditionOptions } from '../../../config/SelfDefinedSelect'
import api from '../../../api'
import request from '../../../request/request'
import FormLabel from '../../../components/FormLabel'
import FilterItem from './FilterItem'
import style from './css/Filter.module.css'
import { OperationDisplayEnum, OperationEnum } from '../../../config/Enum'
import { filterRules } from './rules'
import filterIcon from '../../../assets/common_filter.png'

interface condtionProps {
  operateFlag: OperationEnum
  propertyList: any
  propertyCode: string
  propertyValue: any
  index: number
  deleteCondition: (i: number) => void
}

const Condition = (props: condtionProps) => {
  let tem = props.propertyList.filter((el: any) => {
    return el.param === props.propertyCode
  })[0]
  return (
    <div className={style.condition}>
      <span className={style.propertyName}>
        {tem.name}({tem.param}){' '}
      </span>
      <span className={style.operation}>{OperationDisplayEnum[props.operateFlag]}</span>
      <span className={style.propertyValue}> {props.propertyValue}</span>
      <CloseCircleFilled
        onClick={() => props.deleteCondition(props.index)}
        className={style.deleteIcon}
      />
    </div>
  )
}

const Filter = (props: any) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [hasCondition, setHasCondition] = useState(false)
  const [propertyList, setPropertyList] = useState([])
  const [conditions, setConditions] = useState([])
  const [queryType, setQueryType] = useState('AND')
  const [selectFilter, setSelectFilter] = useState<any>([])
  useEffect(() => {
    if (visible) {
      if (conditions.length > 1) {
        setHasCondition(true)
      } else {
        setHasCondition(false)
      }
      form.setFieldsValue({
        queryInfo: conditions,
        queryType: queryType
      })
    }
  }, [visible, form, conditions, queryType])
  const onFinish = (values: any) => {
    form.validateFields().then((res) => {
      console.log('res', res)
      if (res) {
        console.log(values)
        props.handleFilterCondition(values)
        setConditions(form.getFieldValue('queryInfo') || [])
        setQueryType(form.getFieldValue('queryType') || 'AND')
        setVisible(false)
      }
    })
  }
  const onValuesChange = (oldValues: any, values: any) => {
    console.log(oldValues, values)
  }
  const choseFilter = () => {
    if (!props.modelId) {
      return message.warning('请先选择产品型号')
    }
    setVisible(true)
    form.setFieldsValue({ queryInfo: conditions })
  }
  useEffect(() => {
    if (props.modelId) {
      let params = {
        modelId: props.modelId
      }
      request.get(api.common.select_property, params).then((res) => {
        setPropertyList(res.data)
      })
    }
  }, [props.modelId])
  const deleteCondition = (index: number) => {
    const temp = [...conditions]
    temp.splice(index, 1)
    deleteSelectFilter(index)
    if (temp.length < 2) {
      setHasCondition(false)
    }
    setConditions(temp)
    form.setFieldsValue({ queryInfo: temp })
    props.handleFilterCondition(temp)
  }
  const handleSelectFilter = (preVal: any, newVal: any) => {
    if (preVal) {
      let index = selectFilter.indexOf(preVal)
      selectFilter.splice(index, 1, newVal)
      setSelectFilter([...selectFilter])
    } else {
      setSelectFilter([...selectFilter, newVal])
    }
  }
  const deleteSelectFilter = (index: number) => {
    selectFilter.splice(index, 1)
    setSelectFilter([...selectFilter])
  }
  const reset = () => {
    form.resetFields()
    setHasCondition(false)
    setSelectFilter([])
  }
  const SelfFooter = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {hasCondition ? <Button onClick={reset}>重置</Button> : <span> </span>}
      <div>
        <Button onClick={() => setVisible(false)}>取消</Button>
        <Button type='primary' onClick={() => form.submit()}>
          确定
        </Button>
      </div>
    </div>
  )
  return (
    <>
      <div className={style.filterContainer}>
        <div className={style.filterHeader}>
          <h3>过滤条件</h3>
          {conditions.length > 1 && (
            <div className={style.filterCondition}>
              条件关系：{queryType === 'AND' ? '与' : '或'}
            </div>
          )}
          <Button
            icon={
              <img style={{ verticalAlign: 'sub', marginRight: '4px' }} src={filterIcon} alt='' />
            }
            onClick={choseFilter}
            size='small'>
            设置过滤条件
          </Button>
        </div>
        <div>
          {conditions.map((condition: any, i: number) => {
            return (
              <Condition
                index={i}
                key={i}
                propertyList={propertyList}
                {...condition}
                deleteCondition={deleteCondition}
              />
            )
          })}
        </div>
      </div>
      {visible && (
        <Modal
          wrapClassName='filter-condition'
          title='过滤条件'
          visible={visible}
          destroyOnClose
          maskClosable={false}
          footer={SelfFooter}
          onCancel={() => setVisible(false)}
          onOk={() => form.submit()}>
          <Form
            name='filter_condition'
            scrollToFirstError
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            form={form}
            initialValues={{ queryType: 'AND' }}
            // preserve={false}
            autoComplete='off'>
            {hasCondition && (
              <Form.Item
                label={<FormLabel label='条件关系' />}
                name='queryType'
                rules={[{ required: true }]}>
                <Radio.Group>
                  {ConditionOptions.map((condition: any) => {
                    return (
                      <Radio value={condition.value} key={condition.value}>
                        {condition.label}
                      </Radio>
                    )
                  })}
                </Radio.Group>
              </Form.Item>
            )}
            <Form.List name='queryInfo'>
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field, index) => {
                      return (
                        <Form.Item key={field.key}>
                          <Space>
                            <Form.Item
                              validateFirst={true}
                              noStyle
                              name={[field.name]}
                              rules={filterRules}>
                              <FilterItem
                                propertyList={propertyList}
                                selectFilter={selectFilter}
                                setSelectFilter={(preVal: any, val: any) =>
                                  handleSelectFilter(preVal, val)
                                }
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => {
                                deleteSelectFilter(index)
                                remove(index)
                                if (fields && fields.length === 2) {
                                  setHasCondition(false)
                                }
                              }}
                            />
                          </Space>
                        </Form.Item>
                      )
                    })}
                    <Form.Item>
                      <Button
                        onClick={() => {
                          add()
                          if (fields && fields.length > 0) {
                            setHasCondition(true)
                          } else {
                            setHasCondition(false)
                          }
                        }}
                        block
                        type='dashed'>
                        <PlusOutlined /> 新增过滤条件
                      </Button>
                    </Form.Item>
                  </div>
                )
              }}
            </Form.List>
          </Form>
        </Modal>
      )}
    </>
  )
}

export default Filter
