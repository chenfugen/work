import React, { useState, useEffect } from 'react'
import { Button, Dropdown, Menu, Modal, Spin } from 'antd'
import SeriesEdit from './SeriesEdit'
import classNames from 'classnames'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import request from '../../../request/request'
import api from '../../../api'
import './Series.less'

interface SeriesDto {
  name: string
  code: string
  id: string
}

const Series = (props: any) => {
  console.log(props)
  const [visible, setVisible] = useState(false)
  const [activeSeries, setActiveSeries] = useState('')
  const [row, setRow] = useState({})
  function handleSeriesClick(e: any, series: SeriesDto) {
    e.stopPropagation()
    if (activeSeries === series.id) return
    setActiveSeries(series.id)
    localStorage.setItem('model_select', series.id)
    props.queryModels(series.id, series.name)
  }
  function handleAdd() {
    setRow({})
    setVisible(true)
  }
  useEffect(() => {
    setActiveSeries(props.selectId)
  }, [props.selectId])
  const dropMenu = (series: any) => {
    const deleteSeries = (id: string) => {
      Modal.confirm({
        content: `确认删除${series.name}?`,
        centered: true,
        onOk() {
          let params = {
            id: series.id
          }
          return request.post(api.system.model_series_delete, params).then(() => {
            props.querySeries()
          })
        }
      })
    }
    const editSeries = (series: any) => {
      setRow(series)
      setVisible(true)
    }
    const handleMenuClick = (e: any) => {
      e.domEvent.stopPropagation()
      switch (e.key) {
        case 'delete':
          deleteSeries(series.id)
          break
        case 'edit':
          editSeries(series)
          break
      }
    }
    return (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='edit'>编辑</Menu.Item>
        <Menu.Item key='delete'>删除</Menu.Item>
      </Menu>
    )
  }
  return (
    <div className='series'>
      <div className='series-header'>
        <div className='series-header-desc'>系列列表</div>
        {props.role.editRole ? (
          <Button type='dashed' onClick={handleAdd} icon={<PlusOutlined />} />
        ) : null}
      </div>
      <div className='series-list-container'>
        {props.loading ? (
          <div className='loading-container'>
            <Spin />
          </div>
        ) : props.series.length ? (
          props.series.map((series: any) => (
            <div
              className={classNames('series-item', { active: activeSeries === series.id })}
              key={series.code}
              onClick={(e) => handleSeriesClick(e, series)}>
              <div className='series-item-left'>
                <div className='series-name'>{series.name}</div>
                <div className='series-code'>{series.code}</div>
              </div>
              {props.role.editRole ? (
                <div className='series-item-right' onClick={(e) => e.stopPropagation()}>
                  <Dropdown overlay={dropMenu(series)}>
                    <div className='circle-expend-container'>
                      <EllipsisOutlined />
                    </div>
                  </Dropdown>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className='no-data'>
            暂无系列，点击 <span style={{ fontSize: '16px' }}>+</span> 号创建
          </div>
        )}
      </div>
      {visible && (
        <SeriesEdit
          visible={visible}
          setVisible={setVisible}
          row={row}
          querySeries={props.querySeries}
        />
      )}
    </div>
  )
}

export default Series
