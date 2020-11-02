import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chrome'

const JsonView = (props: any) => {
  return (
    <AceEditor
      style={{ width: '100%', border: '1px solid #eee' }}
      placeholder='暂无属性'
      mode='json'
      theme='chrome'
      name='json-view'
      readOnly={true}
      fontSize={12}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={props.json}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2
      }}
    />
  )
}

export default JsonView
