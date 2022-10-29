const PRIMARY_TYPES = [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'function',
  'symbol',
  'any',
  'void',
  'null',
  'undefined',
  'never',
  'data',
  '',
];
const TYPE_SPLIT = /[\|\&,\<\> \=\[\]\(\)\:"']/;
export const isPrimaryType = (type: string) => {
  type = type.toLocaleLowerCase();
  if (PRIMARY_TYPES.includes(type))
    return true;
  if (type.startsWith('React.'))
    return true;
  const types = type.split(TYPE_SPLIT);
  if (types.length > 1) {
    return types.every(isPrimaryType);
  } else {
    return PRIMARY_TYPES.includes(types[0]);
  }
};

export const getComplicatedType = (type: string) => {
  type = type.toLocaleLowerCase();
  if (PRIMARY_TYPES.includes(type))
    return '';
  if (type.startsWith('React.'))
    return '';
  const cts = type.split(TYPE_SPLIT).filter(t => !isPrimaryType(t));
  if (cts.length >= 1) {
    return cts[0].split('.').pop();
  } else {
    return false;
  }
};
