import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Space, Table } from 'antd'
import style from './css/Chart.module.css'
import echart from 'echarts'
import ChartButtonGroup from './ChartButtonGroup'
import { ChartTypes, DataTypeEnum } from '../../../config/Enum'
import classnames from 'classnames'
import GroupDialog from './GroupDialog'
import ChartTable from './ChartTable'

const Chart = (props: any) => {
  const [groupVisible, setGroupVisible] = useState(false)
  const [hiddenGroup, setHiddenGroup] = useState(true)
  const [chartType, setChartType] = useState(ChartTypes.BAR)
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [groupName, setGroupName] = useState('设置组距')
  const [groupInfo, setGroupInfo] = useState({ groupInterval: '' })
  const echartIntance: any = useRef(null)
  const dom = useRef(null)
  const handleResize = useCallback(() => {
    if (echartIntance.current) {
      echartIntance.current.resize()
    }
  }, [])
  const handleGroupInfo = (info: any) => {
    setGroupInfo(info)
    if (!info.groupInterval && info.groupInterval !== 0) {
      setGroupName(`设置组距`)
    } else {
      setGroupName(`组距：${info.groupInterval}`)
    }
    props.searchWithOutLoading(info)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    if (!echartIntance.current && dom.current) {
      echartIntance.current = echart.init((dom.current as unknown) as HTMLDivElement)
    }
    echartIntance.current.setOption(props.option)
  }, [props.option])
  useEffect(() => {
    setColumns(props.rawColumns)
  }, [props.rawColumns])
  useEffect(() => {
    setDataSource(props.rawTableData)
    console.log(props.rawTableData)
  }, [props.rawTableData])
  useEffect(() => {
    if (props.chartLoading) {
      echartIntance.current.showLoading({
        color: '#7E9AE8'
      })
    } else {
      echartIntance.current && echartIntance.current.hideLoading()
    }
  }, [props.chartLoading])
  const typeChange = (type: ChartTypes) => {
    switch (type) {
      case ChartTypes.BAR:
        setChartType(type)
        break
      case ChartTypes.TABLE:
        setChartType(type)
        return
    }
    echartIntance.current.setOption(props.option)
  }
  const exportTable = () => {
    props.exportTable && props.exportTable(groupInfo)
  }
  useEffect(() => {
    if (props.selectProperty) {
      let hasEmunOrBoolean = props.selectProperty.some((el: any) => {
        return el.type === DataTypeEnum.BOOLEAN || el.type === DataTypeEnum.ENUM
      })
      setHiddenGroup(hasEmunOrBoolean)
    }
  }, [props.selectProperty])
  return (
    <div className={classnames([style.chartContainer, props.border ? style.border : ''])}>
      <div className={style.chartHeader}>
        <h3>{props.noNeedTitle ? ' ' : '频率分布'}</h3>
        <ChartButtonGroup
          chartType='frequency'
          typeChange={typeChange}
          defalutActive={ChartTypes.BAR}
        />
        <Space>
          {!hiddenGroup ? (
            <Button size='middle' onClick={() => setGroupVisible(true)}>
              {groupName}
            </Button>
          ) : null}
          <Button size='middle' onClick={exportTable} id='export_movtion_start'>
            导出数据表
          </Button>
        </Space>
      </div>
      <div className={style.tabs}>
        <div
          ref={dom}
          className={classnames([
            style.chartSize,
            chartType === ChartTypes.TABLE ? style.hidden : ''
          ])}></div>
        <div
          className={classnames([
            style.chartSize,
            chartType === ChartTypes.TABLE ? '' : style.hidden
          ])}>
          <Table
            scroll={{ y: '515px' }}
            size='small'
            rowKey='_index'
            pagination={{
              defaultPageSize: 100,
              pageSizeOptions: ['100', '200'],
              showTotal(total: number) {
                return `共 ${total} 条`
              }
            }}
            dataSource={dataSource}
            columns={columns}></Table>
        </div>
      </div>
      <h3 className={style.tiny}>基本统计量</h3>
      <ChartTable tableData={props.tableData} columns={props.columns} />
      {groupVisible && (
        <GroupDialog
          visible={groupVisible}
          groupInfo={groupInfo}
          setVisible={(visible: boolean) => setGroupVisible(visible)}
          setGroupInfo={handleGroupInfo}
        />
      )}
    </div>
  )
}

export default Chart
