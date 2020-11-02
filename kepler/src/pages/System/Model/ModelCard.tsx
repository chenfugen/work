import React, { useState, useEffect, useRef } from 'react'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Row, Col, Descriptions, Dropdown, Menu, Modal, Spin, message } from 'antd'
import api from '../../../api'
import { useHistory, useRouteMatch, Link } from 'react-router-dom'
import request from '../../../request/request'
import './ModelCard.less'
import { formatTime } from '../../../utils/utils'
import State from '../../../components/State'
import ModelEdit from './ModelEdit'
import ModelCopy from './ModelCopy'
import FormForSearch from '../../../components/FormForSearch'
import RowItem from '../../../components/RowItem'
import qs from 'qs'
const responsiveLayout = {
  xs: { span: 12 },
  sm: { span: 8 },
  md: { span: 8 },
  lg: { span: 8 },
  xl: { span: 6 },
  xxl: { span: 4 }
}

const pahseColor: any = {
  research: 'blue',
  research_complete: 'green'
}

const jsonArr = [
  {
    type: 'input',
    filed: 'code',
    placeholder: '型号编码'
  },
  {
    type: 'input',
    filed: 'name',
    placeholder: '型号名称'
  },
  {
    type: 'select',
    filed: 'phase',
    placeholder: '产品阶段',
    options: [
      {
        code: 'research',
        name: '研测中'
      },
      {
        code: 'research_complete',
        name: '研测完成'
      }
    ]
  }
]

const AddCard = (props: any) => {
  const handleModelAdd = () => {
    props.addModel()
  }
  return (
    <div className='model-card-container add-card' onClick={handleModelAdd}>
      <PlusOutlined />
      <div>新增型号</div>
    </div>
  )
}

const ModeleCard = (props: any) => {
  const searchRef = useRef<any>(null)
  const [visible, setVisible] = useState(false)
  const [copyVisible, setCopyVisible] = useState(false)
  const [modelDetail, setModelDetail] = useState<any>('')
  const [phases, setPhases] = useState([])
  let history = useHistory()
  let { url } = useRouteMatch()
  useEffect(() => {
    if (visible === false) {
      setModelDetail('')
    }
  }, [visible])
  useEffect(() => {
    console.log(searchRef)
    if (searchRef.current) {
      searchRef.current.reset()
    }
  }, [props.seriesId])
  const queryPhases = () => {
    return request.get(api.common.select_phase).then((res) => {
      setPhases(res.data)
    })
  }
  const queryModelDetail = (id: string) => {
    let params = {
      id: id
    }
    return request.get(api.system.model_model_detail, params).then((res) => {
      setModelDetail(res.data)
    })
  }
  const dropMenu = (model: any) => {
    const deleteModel = (id: string) => {
      Modal.confirm({
        content: `确认删除${model.name}?`,
        centered: true,
        onOk() {
          let params = {
            id: model.id
          }
          return request.post(api.system.model_model_delete, params).then((res) => {
            props.queryModels(props.seriesId)
            message.success('删除成功')
          })
        }
      })
    }
    // 编辑型号
    const editModel = (models: any) => {
      Promise.all([queryPhases(), queryModelDetail(models.id)]).then(() => {
        setVisible(true)
      })
    }
    // 复制型号
    const copyModel = (models: any) => {
      setModelDetail(models)
      setCopyVisible(true)
    }
    const handleMenuClick = (e: any) => {
      e.domEvent.stopPropagation()
      switch (e.key) {
        case 'delete':
          deleteModel(model.id)
          break
        case 'edit':
          editModel(model)
          break
        case 'copy':
          copyModel(model)
          break
      }
    }
    return (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='edit'>编辑</Menu.Item>
        <Menu.Item key='copy'>复制</Menu.Item>
        <Menu.Item key='delete'>删除</Menu.Item>
      </Menu>
    )
  }
  const DetailCard = (props: any) => {
    const goDetail = () => {
      history.push(`${url}/detail/${props.id}`)
    }
    return (
      <div className='model-card-container detail-card' onClick={goDetail}>
        <h3 className='model-name' title={props.name}>
          {props.name}
        </h3>
        <State color={pahseColor[props.phase]}>{props.phaseName}</State>
        <RowItem title='型号编码'>
          <span title={props.code}>{props.code}</span>
        </RowItem>
        <RowItem title='通讯方式'>
          <span title={props.code}>{props.communicationMethodName}</span>
        </RowItem>
        <RowItem title='创建时间'>
          <span title={formatTime(props.createTime)}>{formatTime(props.createTime)}</span>
        </RowItem>
        <RowItem title='设备数目'>
          <Link
            style={{ color: '#537ae6' }}
            onClick={(e) => e.stopPropagation()}
            to={{
              pathname: '/device',
              search: qs.stringify({
                select: [props.seriesId, props.id]
              })
            }}>
            {props.num}
          </Link>
        </RowItem>
        {props.role.editRole ? (
          <div className='model-item-right' onClick={(e) => e.stopPropagation()}>
            <Dropdown overlay={dropMenu(props)}>
              <div className='circle-expend-container'>
                <EllipsisOutlined />
              </div>
            </Dropdown>
          </div>
        ) : null}
      </div>
    )
  }
  const addModel = () => {
    setPhases([])
    setModelDetail('')
    setVisible(true)
  }
  const search = (params: any) => {
    props.queryModels(props.seriesId, props.seriesName, params)
  }
  return (
    <div className='model-outer'>
      <div className='model-search-container'>
        <FormForSearch jsonArr={jsonArr} search={search} ref={searchRef} />
      </div>
      <Row gutter={[24, 24]}>
        {props.seriesId && props.role.editRole ? (
          <Col {...responsiveLayout}>
            <AddCard addModel={addModel} />
          </Col>
        ) : null}
        {props.loading ? (
          <Col {...responsiveLayout}>
            <div className='model-loading'>
              <Spin />
            </div>
          </Col>
        ) : (
          props.models.map((el: any) => (
            <Col {...responsiveLayout} key={el.code}>
              <DetailCard {...el} role={props.role} />
            </Col>
          ))
        )}
      </Row>
      {visible && (
        <ModelEdit
          visible={visible}
          setVisible={setVisible}
          {...{ seriesId: props.seriesId, seriesName: props.seriesName }}
          detail={modelDetail}
          phases={phases}
          queryModels={(seriesId: string) => props.queryModels(seriesId)}
        />
      )}
      {copyVisible && (
        <ModelCopy
          visible={copyVisible}
          setVisible={setCopyVisible}
          {...{ seriesId: props.seriesId, modelId: modelDetail.id }}
          queryModels={(seriesId: string) => props.queryModels(seriesId)}
        />
      )}
    </div>
  )
}

export default ModeleCard
