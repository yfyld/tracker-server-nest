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

      case 'noEqual':
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
          if (typeof item.value[0] !== 'undefined') {
            total.push(`${item.key}:*${item.value[0]}*`);
          }
        }
        break;

      case 'notContain':
        {
          if (typeof item.value[0] !== 'undefined') {
            total.push(`not ${item.key}:*${item.value[0]}*`);
          }
        }
        break;

      case 'greater':
        {
          if (typeof item.value[0] === 'number') {
            total.push(`${item.key}>${item.value[0]}`);
          }
        }
        break;

      case 'less':
        {
          if (typeof item.value[0] === 'number') {
            total.push(`${item.key}<${item.value[0]}`);
          }
        }
        break;

      case 'between':
        {
          if (typeof item.value[0] === 'number' && typeof item.value[1] === 'number') {
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
