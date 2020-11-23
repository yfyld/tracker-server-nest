import { IFilterInfo } from './analyse.interface';

export function timeUtilToParam(type: string) {
  let result = {
    window: '1d',
    format: '%Y-%m-%d %H:%i:%s'
  };

  if (type === 'HOURS') {
    result = {
      window: '1h',
      format: '%H'
    };
  } else if (type === 'DAY') {
    result = {
      window: '1d',
      format: '%Y-%m-%d'
    };
  } else if (type === 'WEEK') {
    result = {
      window: '7d',
      format: '%Y-%m-%d'
    };
  } else if (type === 'MONTH') {
    result = {
      window: '30d',
      format: '%Y-%m-%d'
    };
  } else if (type === 'YEAR') {
    result = {
      window: '365d',
      format: '%Y'
    };
  }
  return result;
}

// <Option value='equal'>等于</Option>
// <Option value='notEqual'>不等于</Option>
// <Option value='isSet'>有值</Option>
// <Option value='notSet'>没值</Option>

// <Option value='greater'>大于</Option>
// <Option value='less'>小于</Option>
// <Option value='between'>区间</Option>

// <Option value='contain'>包含</Option>
// <Option value='notContain'>不包含</Option>
// <Option value='isEmpty'>为空</Option>
// <Option value='isNotEmpty'>不为空</Option>
// <Option value='rlike'>正则匹配</Option>
// <Option value='notrlike'>正则不匹配</Option>
export function filterToQuery({ filterValues, filterType }: IFilterInfo): string {
  const filterStrs = filterValues.reduce((total, item) => {
    switch (item.type) {
      case 'equal':
        {
          if (item.value.length === 1) {
            total.push(`${item.key}:${item.value[0]}`);
          } else if (item.value.length) {
            total.push(
              `(${item.value
                .map(val => {
                  return `${item.key}:${val}`;
                })
                .join(' or ')})`
            );
          }
        }
        break;

      case 'notEqual':
        {
          if (item.value.length === 1) {
            total.push(`not ${item.key}:${item.value[0]}`);
          } else if (item.value.length) {
            total.push(
              `(${item.value
                .map(val => {
                  return `not ${item.key}:${val}`;
                })
                .join(' and ')})`
            );
          }
        }
        break;

      case 'isSet':
        {
          total.push(`${item.key}:*`);
        }
        break;

      case 'notSet':
        {
          total.push(`not ${item.key}:*`);
        }
        break;

      case 'isEmpty':
        {
          total.push(`${item.key}:""`);
        }
        break;

      case 'isNotEmpty':
        {
          total.push(`not ${item.key}:""`);
        }
        break;

      case 'rlike':
        {
          if (typeof item.value[0] !== 'undefined') {
            if (/\*|\?/.test(item.value[0])) {
              total.push(`${item.key}:${item.value[0]}`);
            } else {
              total.push(`${item.key}:*${item.value[0]}*`);
            }
          }
        }
        break;

      case 'notrlike':
        {
          if (typeof item.value[0] !== 'undefined') {
            if (/\*|\?/.test(item.value[0])) {
              total.push(`not ${item.key}:${item.value[0]}`);
            } else {
              total.push(`not ${item.key}:*${item.value[0]}*`);
            }
          }
        }
        break;

      case 'contain':
        {
          if (!item.value || typeof item.value[0] === 'undefined') {
            return;
          }

          if (item.value.length === 1) {
            total.push(`${item.key}:*${item.value[0]}*`);
          } else if (item.value.length) {
            total.push(
              `(${item.value
                .map(val => {
                  return `${item.key}:*${val}*`;
                })
                .join(' or ')})`
            );
          }
        }
        break;

      case 'notContain':
        {
          if (!item.value || typeof item.value[0] === 'undefined') {
            return;
          }

          if (item.value.length === 1) {
            total.push(`not ${item.key}:*${item.value[0]}*`);
          } else if (item.value.length) {
            total.push(
              `(${item.value
                .map(val => {
                  return `not ${item.key}:*${val}*`;
                })
                .join(' and ')})`
            );
          }
        }
        break;

      case 'greater':
        {
          if (item.value && typeof item.value[0] !== 'undefined') {
            total.push(`${item.key}>${item.value[0]}`);
          }
        }
        break;

      case 'less':
        {
          if (item.value && typeof item.value[0] !== 'undefined') {
            total.push(`${item.key}<${item.value[0]}`);
          }
        }
        break;

      case 'between':
        {
          if (item.value && typeof item.value[0] !== 'undefined' && typeof item.value[0] !== 'undefined') {
            total.push(`${item.key} in [${item.value[0]},${item.value[1]}]`);
          }
        }
        break;

      default:
        break;
    }
    return total;
  }, []);

  if (!filterStrs.length) {
    return ' ';
  }

  return filterStrs.length > 1
    ? '(' + filterStrs.join(` ${filterType ? 'and' : 'or'} `) + ') and '
    : filterStrs.join(` ${filterType ? 'and' : 'or'} `) + ' and ';
}

/**
 * 生成sql group order
 * @param dimension
 * @param hasTime
 */
export function getGroup(dimension: string, hasTime: boolean) {
  if (dimension && !hasTime) {
    return `,${dimension}  GROUP BY ${dimension}`;
  } else if (dimension && hasTime) {
    return `,${dimension} GROUP BY time, ${dimension} ORDER BY time`;
  } else if (hasTime) {
    return ` group by time order by time`;
  } else {
    return ``;
  }
}

export function getProjectFilter(projectId: number, associationProjectId: number, associationProjectIds: number[]) {
  if (projectId && (!associationProjectIds.length || associationProjectId === projectId || !associationProjectId)) {
    return ` projectId:${projectId} `;
  }

  if (associationProjectIds.length && associationProjectId && associationProjectIds.includes(associationProjectId)) {
    return ` projectId:${associationProjectId} `;
  }

  if (associationProjectIds.length && !associationProjectId) {
    return associationProjectIds.map(item => ` projectId:${item} `).join(' and ');
  }
  throw '当前分析终数据不存在或无权限';
}
