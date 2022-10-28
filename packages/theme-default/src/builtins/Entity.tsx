import React, { useContext } from 'react';
import type { IApiComponentProps } from 'dumi/theme';
import { context, useApiData } from 'dumi/theme';
import Table from './Table';
import { isPrimaryType, getComplicatedType } from '../utils/isPrimaryType';

const LOCALE_TEXTS = {
  'zh-CN': {
    name: '属性名',
    description: '描述',
    type: '类型',
    default: '默认值',
    required: '(必选)',
  },
  'en-US': {
    name: 'Name',
    description: 'Description',
    type: 'Type',
    default: 'Default',
    required: '(required)',
  },
};
const linkRegG = /\{@link\s*?(\S*?)\s*?\|(.*?)\}/g;
const linkReg = /\{@link\s*?(\S*?)\s*?\|(.*?)\}/;

export default ({ identifier, export: expt }: IApiComponentProps) => {
  const data = useApiData(identifier);
  const { locale } = useContext(context);
  const texts = /^zh|cn$/i.test(locale) ? LOCALE_TEXTS['zh-CN'] : LOCALE_TEXTS['en-US'];

  return (
    <>
      {data && (
        <Table>
          <thead>
            <tr>
              <th>{texts.name}</th>
              <th>{texts.description}</th>
              <th>{texts.type}</th>
              <th>{texts.default}</th>
            </tr>
          </thead>
          <tbody>
            {data[expt]?.map(row => {
              if (linkReg.test(row.description)) {
                const groups = row.description.match(linkRegG);
                const links = groups.map(group => {
                  const [, target, name] = group.match(linkReg);
                  return {
                    title: name,
                    url: target,
                  };
                });
                row.links = links;
                row.description = row.description.replaceAll(linkRegG, '');
              }
              return (
                <tr key={row.identifier}>
                  <td>{row.identifier}</td>
                  <td>
                    <span dangerouslySetInnerHTML={{ __html: row.description }} />
                    {row.links && <br /> &&
                      row.links?.map((link, i) => (
                        <a key={link.title} href={link.url}>
                          {link.title}
                        </a>
                      ))}
                  </td>
                  <td>
                    <a
                      href={
                        isPrimaryType(row.type)
                          ? 'javascript:void(0);'
                          : `#entity-${getComplicatedType(row.type)}`
                      }
                    >
                      <code>{row.type}</code>
                    </a>
                  </td>
                  <td>
                    <code>{row.default || (row.required && texts.required) || '--'}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};
