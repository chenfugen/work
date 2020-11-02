import React, { useEffect, useRef, useState } from 'react'
import { Popover, Badge, Button, Progress, Spin } from 'antd'
import style from './index.module.css'
import { CloseCircleFilled } from '@ant-design/icons'
import { ExportStatusEnum } from '../../config/Enum'
import request from '../../request/request'
import api from '../../api'
import { multiply } from 'mathjs'
import { formatSize } from '../../utils/utils'
import { ReactComponent as DownloadLogo } from '../../assets/common_convert.svg'

const Title = () => {
  return (
    <div className={style.downloadHead}>
      <h3 className={style.downloadTitle}>导出列表</h3>
      <span className={style.downloadTips}> </span>
    </div>
  )
}

const Item = (props: any) => {
  const [process, setProcess] = useState(props.progress)
  const [detail, setDetail] = useState(props)
  const [stop, setStop] = useState(false)
  const timeId = useRef<any>(null)
  const queryProcess = (id: string) => {
    if (stop) return
    timeId.current = setTimeout(() => {
      let params = {
        id: props.id
      }
      request.get(api.common.export_progress, params).then((res: any) => {
        setProcess(res.data.progress)
        if (stop) return
        if (res.data.status === ExportStatusEnum.PROCESS) {
          queryProcess(id)
        } else {
          setDetail(res.data)
        }
      })
    }, 1200)
  }
  useEffect(() => {
    if (props.status === ExportStatusEnum.PROCESS) {
      queryProcess(props.id)
    }
    return () => {
      setStop(true)
      clearTimeout(timeId.current)
    }
  }, [])
  const downloadFile = () => {
    window.open(props.downloadUrl, '_self')
    let params = {
      id: props.id
    }
    request.post(api.common.export_count_add, params).then(() => {
      props.countPlusOne(props.id)
    })
  }
  const deleteExport = () => {
    let params = {
      id: props.id
    }
    request.post(api.common.export_delete, params).then(() => {
      props.deleteById(props.id)
    })
  }
  return (
    <div className={style.downloadItem}>
      <div className={style.downloadItemBody}>
        <div className={style.downloadItemBodyTitle} title={detail.fileName}>
          {detail.fileName}
        </div>
        <div className={style.downloadItemBottom}>
          {detail.status === ExportStatusEnum.PROCESS && (
            <Progress percent={multiply(process, 100)} size='small' status='active' />
          )}
          {detail.status === ExportStatusEnum.fAIL && (
            <>
              <Progress
                style={{ width: 112 }}
                percent={multiply(process, 100)}
                size='small'
                status='exception'
              />
              <span style={{ color: 'red' }}>生成失败</span>
            </>
          )}
          {detail.status === ExportStatusEnum.SUCCESS && (
            <div className={style.downloadItemSuccess}>
              <span style={{ width: '40%' }}>{formatSize(detail.fileSize)}</span>
              {detail.times ? <span style={{ width: '60%' }}>已下载 {detail.times} 次</span> : null}
            </div>
          )}
        </div>
      </div>
      <div>
        {detail.status === ExportStatusEnum.SUCCESS && detail.downloadUrl && (
          <Button type='link' onClick={downloadFile}>
            下载
          </Button>
        )}
        <CloseCircleFilled onClick={deleteExport} className={style.deleteIcon} />
      </div>
    </div>
  )
}
const Content = (props: any) => {
  const [list, setList] = useState<any>([])
  useEffect(() => {
    setList(props.list)
  }, [props.list])
  const countPlusOne = (id: string) => {
    let newList = list.map((el: any) => {
      if (el.id === id) {
        return {
          ...el,
          times: (el.times || 0) + 1
        }
      } else {
        return { ...el }
      }
    })
    setList(newList)
  }
  const deleteById = (id: string) => {
    let newList = list.filter((el: any) => {
      return el.id !== id
    })
    setList(newList)
  }
  return (
    <div className={style.listContainer}>
      {props.loading ? (
        <div className={style.empty}>
          <Spin />
        </div>
      ) : list.length !== 0 ? (
        list.map((el: any) => (
          <Item {...el} key={el.id} countPlusOne={countPlusOne} deleteById={deleteById} />
        ))
      ) : (
        <div className={style.empty}>暂无导出数据</div>
      )}
    </div>
  )
}

const Download = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const handleVisible = (visible: boolean) => {
    if (visible) {
      queryExportList()
    } else {
      setList([])
    }
  }
  const queryExportList = () => {
    setLoading(true)
    return request
      .get(api.common.export_list)
      .then((res) => {
        setList(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Popover
      onVisibleChange={handleVisible}
      trigger='click'
      destroyTooltipOnHide
      title={<Title />}
      content={<Content list={list} loading={loading} />}
      placement='bottomRight'
      overlayClassName={style.exportPopover}>
      <div className={style.download}>
        <Badge count={0} size='small' className={style.align}>
          <div className={style.circle} id='export_movtion_end'>
            <DownloadLogo title='导出列表' />
          </div>
        </Badge>
      </div>
    </Popover>
  )
}

export default Download
