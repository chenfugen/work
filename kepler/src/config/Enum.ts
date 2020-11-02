// 数据类型
export enum DataTypeEnum {
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  ENUM = 'ENUM',
  DATE = 'DATE'
}

// 数据类型名称
export enum DataTypeNameEnum {
  INTEGER = 'int32 (整数型)',
  FLOAT = 'float (单精度浮点型)',
  DOUBLE = 'double (双精度浮点型)',
  STRING = 'string (字符串)',
  BOOLEAN = 'bool (布尔型)',
  ENUM = 'enum (枚举型)',
  DATE = 'date (时间型)'
}

// 数据类型名称 only 中文
export enum DataTypeNameDisplayEnum {
  INTEGER = '整数型',
  FLOAT = '单精度浮点型',
  DOUBLE = '双精度浮点型',
  STRING = '字符串',
  BOOLEAN = '布尔型',
  ENUM = '枚举型',
  DATE = '时间'
}

// 操作符 enum
export enum OperationEnum {
  is = 'is',
  gt = 'gt',
  lt = 'lt',
  gte = 'gte',
  lte = 'lte',
  ne = 'ne',
  include = 'include',
  exclude = 'exclude'
}

// 操作符展示 enum
export enum OperationDisplayEnum {
  is = '=',
  gt = '>',
  lt = '<',
  gte = '>=',
  lte = '<=',
  ne = '!=',
  include = '包含',
  exclude = '不包含'
}

// 图表类型 枚举
export enum ChartTypes {
  CURVE = 'curve',
  DOT = 'dot',
  AREA = 'area',
  BAR = 'bar',
  LINE = 'line',
  TABLE = 'table'
}

// 时间间隔以及数据分类类型 枚举
export enum SamplingTypesEnum {
  RAW = 'raw',
  ANY = 'any',
  MIN = 'min',
  MAX = 'max',
  AVG = 'avg'
}

// 时间间隔以及数据分类类型 展示 枚举
export enum SamplingTypesDisplayEnum {
  raw = '原始数据',
  any = '随机值',
  min = '最小值',
  max = '最大值',
  avg = '平均值'
}

// 下载列表状态 枚举
export enum ExportStatusEnum {
  PROCESS = 'process',
  SUCCESS = 'success',
  fAIL = 'fail'
}
